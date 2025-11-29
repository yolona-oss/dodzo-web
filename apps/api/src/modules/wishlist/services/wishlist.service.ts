import { AddWishlistItemDto, CreateWishlistDto, RemoveWishlistItemDto } from "@dodzo-web/shared";
import { CartItem, Product, Restaurant, User, Wishlist, WishlistItem } from "@entities/index";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { AppErrors } from "common/error";
import { CartService } from "modules/cart/services/cart.service";

@Injectable()
export class WishlistService {
    constructor(
        @InjectRepository(Wishlist)
        private readonly wishlistRepo: EntityRepository<Wishlist>,
        @InjectRepository(WishlistItem)
        private readonly wishlistItemRepo: EntityRepository<WishlistItem>,
        @InjectRepository(Product)
        private readonly productRepo: EntityRepository<Product>,
        private readonly em: EntityManager,
    ) {}

    async createWishlist(dto: CreateWishlistDto): Promise<Wishlist> {
        const user = await this.em.findOneOrFail(User, dto.userId);
        const restaurant = await this.em.findOneOrFail(Restaurant, dto.restaurantId);

        const wishlist = this.wishlistRepo.create({
            user,
            restaurant,
            items: [],
        });

        await this.em.persistAndFlush(wishlist);
        return wishlist;
    }

    async getUserWishlist(userId: string, restaurantId: string): Promise<Wishlist | null> {
        return this.wishlistRepo.findOne(
            {
                user: userId,
                restaurant: restaurantId,
            },
            { populate: ['items.product'] },
        );
    }

    async getOrCreateDefaultWishlist(
        userId: string,
        restaurantId: string,
    ): Promise<Wishlist> {
        let wishlist = await this.getUserWishlist(userId, restaurantId);

        if (!wishlist) {
            wishlist = await this.createWishlist({
                userId,
                restaurantId,
                isDefault: true,
            });
        }

        return wishlist;
    }

    async getUserWishlists(userId: string): Promise<Wishlist[]> {
        return this.wishlistRepo.find(
            { user: userId },
            { populate: ['items.product', 'restaurant'] },
        );
    }

    async addItem(dto: AddWishlistItemDto): Promise<WishlistItem> {
        return this.em.transactional(async (em) => {
            const wishlist = await this.wishlistRepo.findOneOrFail(dto.wishlistId, {
                populate: ['items.product'],
            });

            const product = await this.productRepo.findOneOrFail(dto.productId);

            const existingItem = wishlist.items
            .getItems()
            .find((item) => item.product.id === product.id);

            if (existingItem) {
                throw AppErrors.badRequest('Product already in wishlist');
            }

            const wishlistItem = this.wishlistItemRepo.create({
                wishlist,
                product,
                notifyOnAvailable: dto.notifyOnAvailable,
            });

            em.persist(wishlistItem);
            await em.flush();

            return wishlistItem;
        });
    }

    async removeItem(dto: RemoveWishlistItemDto): Promise<void> {
        const wishlistItem = await this.wishlistItemRepo.findOneOrFail(dto.wishlistItemId);
        await this.em.removeAndFlush(wishlistItem);
    }

    async updateItem(
        wishlistItemId: string,
        notifyOnAvailable?: boolean,
    ): Promise<WishlistItem> {
        const item = await this.wishlistItemRepo.findOneOrFail(wishlistItemId);

        if (notifyOnAvailable !== undefined) {
            item.notifyOnAvailable = notifyOnAvailable;
        }

        await this.em.flush();
        return item;
    }

    async isInWishlist(userId: string, productId: string, restaurantId: string): Promise<boolean> {
        const wishlist = await this.getUserWishlist(userId, restaurantId);
        if (!wishlist) return false;

        const item = await this.wishlistItemRepo.findOne({
            wishlist: wishlist.id,
            product: productId,
        });

        return !!item;
    }

    async moveToCart(
        wishlistItemId: string,
        cartService: CartService,
        quantity: number = 1,
        isForDelivery: boolean = true,
    ): Promise<CartItem> {
        return this.em.transactional(async (_) => {
            const wishlistItem = await this.wishlistItemRepo.findOneOrFail(
                wishlistItemId,
                { populate: ['wishlist.user', 'wishlist.restaurant', 'product'] },
            );

            const cart = await cartService.getOrCreateCart(
                wishlistItem.wishlist.user.id,
                wishlistItem.wishlist.restaurant.id,
            );

            // Add to cart
            const cartItem = await cartService.addItem({
                cartId: cart.id,
                productId: wishlistItem.product.id,
                quantity,
                isForDelivery,
            });

            await this.removeItem({ wishlistItemId });

            return cartItem;
        });
    }

    async clearWishlist(wishlistId: string): Promise<void> {
        const wishlist = await this.wishlistRepo.findOneOrFail(wishlistId, {
            populate: ['items'],
        });

        wishlist.items.removeAll();
        await this.em.flush();
    }
}
