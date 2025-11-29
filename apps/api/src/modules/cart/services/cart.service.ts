import { AddCartItemDto, RemoveCartItemDto, UpdateCartItemDto } from "@dodzo-web/shared";
import { Cart, CartItem, Product, Restaurant, RestaurantProduct, User } from "@entities/index";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { AppErrors } from "common/error";
import { PromotionService } from "modules/promotion/services/promotion.service";

@Injectable()
export class CartService {
    constructor(
        private readonly promotionService: PromotionService,
        @InjectRepository(Cart)
        private readonly cartRepo: EntityRepository<Cart>,
        @InjectRepository(CartItem)
        private readonly cartItemRepo: EntityRepository<CartItem>,
        @InjectRepository(Product)
        private readonly productRepo: EntityRepository<Product>,
        @InjectRepository(RestaurantProduct)
        private readonly restaurantProductRepo: EntityRepository<RestaurantProduct>,
        private readonly em: EntityManager,
    ) {}

    async getOrCreateCart(userId: string, restaurantId: string): Promise<Cart> {
        let cart = await this.cartRepo.findOne(
            {
                user: userId,
                restaurant: restaurantId,
                isActive: true,
            },
            { populate: ['items.product'] },
        );

        if (!cart) {
            const user = await this.em.findOneOrFail(User, userId);
            const restaurant = await this.em.findOneOrFail(Restaurant, restaurantId);

            const cart = this.cartRepo.create({
                user,
                restaurant,
                isActive: true,
            });

            await this.em.persistAndFlush(cart);
        }

        return cart!;
    }

    async getCart(cartId: string): Promise<Cart> {
        return this.cartRepo.findOneOrFail(
            cartId,
            { 
                populate: ['items.product', 'restaurant', 'user'],
            },
        );
    }

    async getUserActiveCart(userId: string, restaurantId: string): Promise<Cart | null> {
        return this.cartRepo.findOne(
            {
                user: userId,
                restaurant: restaurantId,
                isActive: true,
            },
            { populate: ['items.product', 'items.product.ingredients'] },
        );
    }

    async addItem(dto: AddCartItemDto): Promise<CartItem> {
        return this.em.transactional(async (em) => {
            const cart = await this.cartRepo.findOneOrFail(dto.cartId, {
                populate: ['items.product', 'restaurant'],
            });

            const product = await this.productRepo.findOneOrFail(dto.productId);

            // Check if product is available at this restaurant
            const restaurantProduct = await this.restaurantProductRepo.findOne({
                restaurant: cart.restaurant.id,
                product: product.id,
                isAvailable: true,
            });

            if (!restaurantProduct) {
                throw AppErrors.badRequest('Product not available at this restaurant');
            }

            if (dto.isForDelivery && !restaurantProduct.availableForDelivery) {
                throw AppErrors.badRequest('Product not available for delivery');
            }
            if (!dto.isForDelivery && !restaurantProduct.availableInLounge) {
                throw AppErrors.badRequest('Product not available in lounge');
            }

            const existingItem = cart.items.getItems().find(
                (item) => 
                    item.product.id === product.id && 
                        JSON.stringify(item.meta) === JSON.stringify(dto.meta)
            );

            if (existingItem) {
                existingItem.qty += dto.quantity;
                await em.flush();

                return existingItem;
            }

            const price = restaurantProduct.priceOverride || product.basePrice;
            const cartItem = this.cartItemRepo.create({
                cart,
                product,
                qty: dto.quantity,
                meta: dto.meta,
                priceAtAdd: price,
            });

            em.persist(cartItem);
            await em.flush();

            await this.promotionService.applyPromotionsToCart(cart)

            return cartItem;
        });
    }

    async updateItem(dto: UpdateCartItemDto): Promise<CartItem> {
        const cartItem = await this.cartItemRepo.findOneOrFail(dto.cartItemId, { populate: ['cart'] });

        if (dto.quantity !== undefined) {
            if (dto.quantity <= 0) {
                throw AppErrors.badRequest('Quantity must be greater than 0');
            }
            cartItem.qty = dto.quantity;
        }

        if (dto.meta !== undefined) {
            cartItem.meta = dto.meta;
        }

        await this.em.flush();

        await this.promotionService.applyPromotionsToCart(cartItem.cart)

        return cartItem;
    }

    async removeItem(dto: RemoveCartItemDto): Promise<void> {
        const cartItem = await this.cartItemRepo.findOneOrFail(dto.cartItemId, { populate: ['cart'] });
        await this.em.removeAndFlush(cartItem);
        await this.promotionService.applyPromotionsToCart(cartItem.cart)
    }

    async clearCart(cartId: string): Promise<void> {
        const cart = await this.cartRepo.findOneOrFail(cartId, {
            populate: ['items'],
        });

        cart.items.removeAll();
        await this.em.flush();
    }

    async calculateCartTotal(cartId: string): Promise<{
        subtotal: number;
        itemCount: number;
        items: Array<{
            cartItemId: string;
            productName: string;
            quantity: number;
            unitPrice: number;
            totalPrice: number;
        }>;
    }> {
        const cart = await this.cartRepo.findOneOrFail(cartId, {
            populate: ['items.product'],
        });

        let subtotal = 0;
        let itemCount = 0;

        const items = cart.items.getItems().map((item) => {
            const totalPrice = item.priceAtAdd * item.qty;
            subtotal += totalPrice;
            itemCount += item.qty;

            return {
                cartItemId: item.id,
                productName: item.product.name,
                quantity: item.qty,
                unitPrice: item.priceAtAdd,
                totalPrice,
            };
        });

        return { subtotal, itemCount, items };
    }

    async deactivateCart(cartId: string): Promise<void> {
        const cart = await this.cartRepo.findOneOrFail(cartId);
        cart.isActive = false;
        await this.em.flush();
    }

    async cleanupExpiredCarts(): Promise<number> {
        const expiredCarts = await this.cartRepo.find({
            expiresAt: { $lte: new Date() },
            isActive: true,
        });

        for (const cart of expiredCarts) {
            cart.isActive = false;
        }

        await this.em.flush();
        return expiredCarts.length;
    }
}
