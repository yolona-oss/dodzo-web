import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CartEntity } from 'common/entities/Cart.entity';
import { ProductEntity } from 'common/entities/Product.entity';
import { CartItemEntity } from 'common/entities/CartItem.entity';

import { AppError, AppErrors, AppErrorTypeEnum } from './../../../common/app-error';
import { AddToCartDto, RemoveFromCartDto, UpdateCartDto } from '@dodzo-web/shared';
import { CustomerEntity } from 'common/entities/Customer.entity';
import { ProductStockEntity } from 'common/entities/ProductStock.entity';
import { OrganizationEntity } from 'common/entities/Organization.entity';
import { ProductStockService } from 'organization/stock/services/stock.service';
import { ProductStockSettingService } from 'organization/stock/services/stock-setting.service';
import { StockUtils } from 'organization/stock/stock.utils';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(CartEntity)
        private readonly cartRepo: Repository<CartEntity>,
        @InjectRepository(ProductEntity)
        private readonly productRepo: Repository<ProductEntity>,
        @InjectRepository(CartItemEntity)
        private readonly cartItemRepo: Repository<CartItemEntity>,
        @InjectRepository(CustomerEntity)
        private readonly customerRepo: Repository<CustomerEntity>,
        @InjectRepository(ProductStockEntity)
        private readonly stockRepo: Repository<ProductStockEntity>,
        @InjectRepository(OrganizationEntity)
        private readonly orgRepo: Repository<OrganizationEntity>,

        private readonly stockService: ProductStockService,
        private readonly stockSettingService: ProductStockSettingService,
    ) {}

    async findAll() {
        return await this.cartRepo.find({
            relations: ["items", "items.product"]
        })
    }

    async findById(cartId: string) {
        return await this.cartRepo.findOne({
            where: { id: cartId },
            relations: ["items", "items.product"]
        })
    }

    async findByCustomerId(customerId: string): Promise<CartEntity> {
        const cart = await this.cartRepo.findOne({
            where: { customer: { id: customerId } },
            relations: ['items', 'items.product'],
        });

        if (!cart) {
            // Create cart if it doesn't exist
            const customer = await this.customerRepo.findOne({ where: { id: customerId } });
            if (!customer) {
                throw AppErrors.dbEntityNotFound("Customer not found");
            }

            const newCart = this.cartRepo.create({ customer });
            return this.cartRepo.save(newCart);
        }

        return cart;
    }

    async remove(id: string) {
        const res = await this.cartRepo.delete(id)
        if (res.affected === 0) {
            throw new AppError(AppErrorTypeEnum.DB_CANNOT_DELETE, { message: "Cart cannot be deleted: not found" })
        }
    }

    async clearCart(customerId: string) {
        const cart = await this.findByCustomerId(customerId);

        await this.cartItemRepo.remove(cart.items);
        cart.items = [];

        return this.cartRepo.save(cart);
    }

    async validateCart(customerId: string): Promise<{ valid: boolean; errors: string[] }> {
        const cart = await this.findByCustomerId(customerId);
        const errors: string[] = [];

        for (const item of cart.items) {
            const product = await this.productRepo.findOne({ where: { id: item.product.id } });

            if (!product) {
                errors.push(`Product ${item.product.title} is no longer available`);
                continue;
            }

            if (product.price !== item.product.price) {
                errors.push(`Price has changed for ${product.title}. New price: $${product.price}`);
            }
            //
            // if ()
        }

        return {
            valid: errors.length === 0,
            errors,
        };
    }

    async totalCartPrice(customerId: string) {
        const cart_e = await this.findByCustomerId(customerId)
        if (!cart_e) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }

        if (cart_e.items.length === 0) {
            return 0
        }

        return cart_e.items
            .reduce(
                (total, product) =>
                    total + product.product.price * product.quantity,
                0
            )
    }

    async addItem(customerId: string, dto: AddToCartDto): Promise<CartEntity> {
        const cart = await this.findByCustomerId(customerId);

        const organization = await this.orgRepo.findOneBy({ id: dto.organizationId });
        if (!organization) {
            throw AppErrors.dbEntityNotFound("Organization not found");
        }


        const stock_ = await this.stockService.getStock(dto.productId, dto.organizationId);
        const settings = await this.stockSettingService.getByOrg(dto.organizationId);

        if (!StockUtils.hasSufficientStock(stock_, dto.quantity, settings)) {
          throw AppErrors.invalidRange('Not enough stock available');
        }

        const existingItem = cart.items.find(item => item.product.id === dto.productId);

        if (existingItem) {
            const newQty = existingItem.quantity + dto.quantity;

            if (!stock_.isInfinite && stock_.count! < newQty) {
                throw AppErrors.invalidRange('Exceeds available stock');
            }

            existingItem.quantity = newQty;
            await this.cartItemRepo.save(existingItem);
        } else {
            const newItem = this.cartItemRepo.create({
                cart,
                product: stock_.product,
                organization,
                quantity: dto.quantity,
            });
            await this.cartItemRepo.save(newItem);
            cart.items.push(newItem);
        }

        return await this.cartRepo.save(cart);
    }

    async removeItem(customerId: string, dto: RemoveFromCartDto): Promise<CartEntity> {
        const cart = await this.findByCustomerId(customerId);
        const item = cart.items.find(item => item.product.id === dto.productId);

        if (!item) {
            throw AppErrors.dbCannotUpdate("Item not found in cart");
        }

        await this.cartItemRepo.remove(item);

        // Remove item from cart array
        cart.items = cart.items.filter(item => item.product.id !== dto.productId);

        return await this.cartRepo.save(cart);
    }

    async updateItemQuantity(customerId: string, dto: UpdateCartDto): Promise<CartEntity> {
        const cart = await this.findByCustomerId(customerId);
        const item = cart.items.find(item => item.product.id === dto.productId);

        if (!item) {
            throw AppErrors.dbCannotUpdate("Item not found in cart");
        }

        if (dto.quantity <= 0) {
            // Remove item if count is 0 or negative
            return this.removeItem(customerId, { productId: dto.productId });
        }

        item.quantity = dto.quantity;
        await this.cartItemRepo.save(item);

        return await this.cartRepo.save(cart);
    }
}
