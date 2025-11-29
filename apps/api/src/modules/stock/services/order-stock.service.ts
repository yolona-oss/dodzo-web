import { Injectable } from "@nestjs/common";
import { RestaurantStockService } from "./restaurant-stock.service";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Cart, Order, OrderItem } from "@entities/index";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { AppErrors } from "common/error";
import { OrderType } from "@dodzo-web/shared";
import { ProductIngredientService } from "modules/product/services/product-ingredient.service";

@Injectable()
export class OrderStockService {
    constructor(
        private readonly restaurantStockService: RestaurantStockService,
        private readonly productIngredientService: ProductIngredientService,
        @InjectRepository(Order)
        private readonly orderRepo: EntityRepository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderItemRepo: EntityRepository<OrderItem>,
        private readonly em: EntityManager,
    ) {}

    async checkOrderStockAvailability(
        restaurantId: string,
        items: Array<{ productId: string; quantity: number; isForDelivery: boolean }>,
    ): Promise<{
        available: boolean;
        unavailableItems: Array<{
            productId: string;
            supplyItemId: string;
            required: number;
            available: number;
        }>;
    }> {
        const unavailableItems = [];

        for (const item of items) {
            const ingredients = await this.productIngredientService.getProductIngredients(
                item.productId,
                item.isForDelivery,
            );

            for (const ingredient of ingredients) {
                const required = ingredient.quantity * item.quantity;
                const available = await this.restaurantStockService.getCurrentStock(
                    restaurantId,
                    ingredient.supplyItemId,
                );

                if (available < required) {
                    unavailableItems.push({
                        productId: item.productId,
                        supplyItemId: ingredient.supplyItemId,
                        required,
                        available,
                    });
                }
            }
        }

        return {
            available: unavailableItems.length === 0,
            unavailableItems,
        };
    }

    async consumeStockForOrder(
        orderId: string,
        userId?: string,
    ): Promise<void> {
        return this.em.transactional(async (_) => {
            const order = await this.orderRepo.findOneOrFail(
                orderId,
                { populate: ['items.product', 'restaurant'] },
            );

            // Check stock availability first
            const stockCheck = await this.checkOrderStockAvailability(
                order.restaurant.id,
                order.items.getItems().map((item) => ({
                    productId: item.product.id,
                    quantity: item.qty,
                    isForDelivery: order.orderType === OrderType.DELIVERY,
                })),
            );

            if (!stockCheck.available) {
                throw AppErrors.outOfStock(JSON.stringify(stockCheck.unavailableItems))
            }

            // Consume stock for each order item
            for (const orderItem of order.items.getItems()) {
                const ingredients = await this.productIngredientService.getProductIngredients(
                    orderItem.product.id,
                    order.orderType === 'delivery',
                );

                for (const ingredient of ingredients) {
                    const quantityToConsume = ingredient.quantity * orderItem.qty;

                    await this.restaurantStockService.decrementStock(
                        order.restaurant.id,
                        ingredient.supplyItemId,
                        quantityToConsume,
                        {
                            referenceId: order.id,
                            referenceType: 'order',
                            userId: userId,
                            reason: `Order ${order.id} - ${orderItem.product.name}`,
                            useFIFO: true,
                        },
                    );
                }
            }
        });
    }

    async refundStockForOrder(
        orderId: string,
        reason: string,
        userId?: string,
        itemsToRefund?: string[], // Array of orderItem IDs, if null refunds all
    ): Promise<void> {
        return this.em.transactional(async (_) => {
            const order = await this.orderRepo.findOneOrFail(
                orderId,
                { populate: ['items.product', 'restaurant'] },
            );

            const itemsToProcess = itemsToRefund
                ? order.items.getItems().filter((item) => itemsToRefund.includes(item.id))
                : order.items.getItems();

            // Refund stock for each order item
            for (const orderItem of itemsToProcess) {
                const ingredients = await this.productIngredientService.getProductIngredients(
                    orderItem.product.id,
                    order.orderType === 'delivery',
                );

                for (const ingredient of ingredients) {
                    const quantityToRefund = ingredient.quantity * orderItem.qty;

                    await this.restaurantStockService.incrementStock(
                        order.restaurant.id,
                        ingredient.supplyItemId,
                        quantityToRefund,
                        {
                            referenceId: order.id,
                            referenceType: 'order_refund',
                            userId: userId,
                            notes: `Refund for Order ${order.id} - ${reason}`,
                        },
                    );
                }
            }
        });
    }

    async reserveStockForCart(cartId: string, isForDelivery: boolean): Promise<boolean> {
        const cart = await this.em.findOneOrFail(
            Cart,
            cartId,
            { populate: ['items.product', 'restaurant'] },
        );

        const stockCheck = await this.checkOrderStockAvailability(
            cart.restaurant.id,
            cart.items.getItems().map((item) => ({
                productId: item.product.id,
                quantity: item.qty,
                isForDelivery,
            })),
        );

        return stockCheck.available;
    }
}
