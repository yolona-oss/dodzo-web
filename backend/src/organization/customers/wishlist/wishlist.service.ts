import { Inject, Injectable } from '@nestjs/common';

import { OPQBuilder } from './../../../common/misc/opq-builder';

import { AppError, AppErrors, AppErrorTypeEnum } from './../../../common/app-error';
import { InjectRepository } from '@nestjs/typeorm';
import { WishlistEntity } from 'common/entities/Wishlist.entity';
import { In, Repository } from 'typeorm';
import { CustomerEntity } from 'common/entities/Customer.entity';
import { AddToWishlistDto, MoveToCartDto, RemoveFromWishlistDto } from '@dodzo-web/shared';
import { ProductEntity } from 'common/entities/Product.entity';
import { WishlistItemEntity } from 'common/entities/WishlistItem.entity';
import { CartService } from '../cart/cart.service';
import { OrganizationEntity } from 'common/entities/Organization.entity';
import { ProductStockEntity } from 'common/entities/ProductStock.entity';


@Injectable()
export class WishlistService {
    constructor(
        @InjectRepository(WishlistEntity)
        private readonly wishlistRepo: Repository<WishlistEntity>,
        @InjectRepository(CustomerEntity)
        private readonly customerRepo: Repository<CustomerEntity>,
        @InjectRepository(WishlistItemEntity)
        private readonly wlItemRepo: Repository<WishlistItemEntity>,
        @InjectRepository(ProductEntity)
        private readonly productRepo: Repository<ProductEntity>,
        @InjectRepository(OrganizationEntity)
        private readonly orgRepo: Repository<OrganizationEntity>,
        @InjectRepository(ProductStockEntity)
        private readonly stockRepo: Repository<ProductStockEntity>,

        private readonly cartService: CartService,

    ) {}

    async findAll(relations: string[] = []): Promise<WishlistEntity[]> {
        return await this.wishlistRepo.find({
            relations
        })
    }

    async findByCustomerId(customerId: string): Promise<WishlistEntity> {
        const wishlist = await this.wishlistRepo.findOne({
            where: { customer: { id: customerId } },
            relations: ['items', 'items.product'],
        });

        if (!wishlist) {
            // Create wishlist if it doesn't exist
            const customer = await this.customerRepo.findOne({ where: { id: customerId } });
            if (!customer) {
                throw AppErrors.dbEntityNotFound("Customer not found");
            }

            const newWishlist = this.wishlistRepo.create({ customer });
            return this.wishlistRepo.save(newWishlist);
        }

        return wishlist;
    }

    async isContainsProduct(customerId: string, productId: string): Promise<boolean> {
        const wishlist = await this.findByCustomerId(customerId)
        return Boolean(wishlist && wishlist.items.find(p => p.id === productId))
    }

    /***
    * autocreates wishlist if not found
    */
    async addItem(customerId: string, dto: AddToWishlistDto): Promise<WishlistEntity> {
        let wishlist = await this.findByCustomerId(customerId);

        const organization = await this.orgRepo.findOneBy({ id: dto.organizationId });
        if (!organization) {
            throw AppErrors.dbEntityNotFound("Organization not found");
        }

        const product = await this.productRepo.findOne({ where: { id: dto.productId } });

        if (!product) {
            throw AppErrors.dbCannotCreate("Product not found");
        }

        // Check if item already exists in wishlist
        const existingItem = wishlist.items.find(item => item.product.id === dto.productId);

        if (existingItem) {
            // Item already in wishlist
            return wishlist;
        }

        const newItem = this.wlItemRepo.create({
            wishlist,
            product,
            organization,
            quantity: 1,
        });

        await this.wlItemRepo.save(newItem);
        wishlist.items.push(newItem);

        return await this.wishlistRepo.save(wishlist);
    }

    async removeItem(customerId: string, dto: RemoveFromWishlistDto): Promise<WishlistEntity> {
        const wishlist = await this.findByCustomerId(customerId);
        const item = wishlist.items.find(item => item.product.id === dto.productId);

        if (!item) {
            throw AppErrors.dbCannotUpdate("Item not found in wishlist");
        }

        await this.wlItemRepo.remove(item);

        wishlist.items = wishlist.items.filter(item => item.product.id !== dto.productId);

        return await this.wishlistRepo.save(wishlist);
    }

    async clearWishlist(customerId: string): Promise<WishlistEntity> {
        const wishlist = await this.findByCustomerId(customerId)
        wishlist.items = []
        return await this.wishlistRepo.save(wishlist)
    }


    async moveToCart(customerId: string, dto: MoveToCartDto): Promise<{ wishlist: WishlistEntity; cart: any }> {
        const wishlist = await this.findByCustomerId(customerId);
        const item = wishlist.items.find(item => item.product.id === dto.productId);

        if (!item) {
            throw AppErrors.dbCannotUpdate("Item not found in wishlist");
        }

        const stock = await this.stockRepo.findOne({
            where: {
                organization: { id: dto.organizationId },
                product: { id: dto.productId }
            }
        })

        if (!stock) {
            throw AppErrors.dbEntityNotFound('Product stock not found for organization');
        }

        if (!stock.isInfinite && (stock.count ?? 0) < dto.quantity) {
            throw AppErrors.invalidRange('Not enough stock available');
        }

        // reuse CartService addItem (with stock check)
        const cart = await this.cartService.addItem(customerId, {
            productId: dto.productId,
            organizationId: dto.organizationId,
            quantity: 1,
        });

        await this.removeItem(customerId, { productId: dto.productId });

        return {
            wishlist,
            cart
        };
    }

    async remove(customerId: string) {
        const res = await this.wishlistRepo.delete({ customer: { id: customerId } })
        if (res.affected === 0) {
            throw AppErrors.dbCannotDelete("Wishlist not found")
        }
    }
}
