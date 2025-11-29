import { CancelOrderDto, ConvertCartToOrderDto, CreateOrderDto, OrderStatus, RefundOrderDto, UpdateOrderStatusDto } from "@dodzo-web/shared";
import { Order, OrderItem, Product, ProductIngredient, ProductPackaging, Restaurant, RestaurantProduct, User } from "@entities/index";
import { InjectRepository } from "@mikro-orm/nestjs";
import { CreateRequestContext, EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { AppErrors } from "common/error";
import { CartService } from "modules/cart/services/cart.service";
import { OrderStockService } from "modules/stock/services/order-stock.service";
import { RestaurantStockService } from "modules/stock/services/restaurant-stock.service";

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepo: EntityRepository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderItemRepo: EntityRepository<OrderItem>,
        @InjectRepository(Product)
        private readonly productRepo: EntityRepository<Product>,
        @InjectRepository(RestaurantProduct)
        private readonly restaurantProductRepo: EntityRepository<RestaurantProduct>,
        private readonly cartService: CartService,
        private readonly orderStockService: OrderStockService,
        // private readonly restaurantStockService: RestaurantStockService,
        private readonly em: EntityManager,
    ) {}

    @CreateRequestContext()
    async createOrder(userId: string, dto: CreateOrderDto): Promise<Order> {
        return this.em.transactional(async (em) => {
            const user = await em.findOneOrFail(User, userId);
            const restaurant = await em.findOneOrFail(Restaurant, dto.restaurantId);

            // Check stock availability
            const stockCheck = await this.orderStockService.checkOrderStockAvailability(
                dto.restaurantId,
                dto.items.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    isForDelivery: dto.orderType === 'delivery',
                })),
            );

            if (!stockCheck.available) {
                throw AppErrors.outOfStock( JSON.stringify(stockCheck.unavailableItems));
            }

            // Calculate totals
            let subtotal = 0;
            const orderItems: OrderItem[] = [];

            for (const itemDto of dto.items) {
                const product = await this.productRepo.findOneOrFail(itemDto.productId);
                const restaurantProduct = await this.restaurantProductRepo.findOne({
                    restaurant: dto.restaurantId,
                    product: itemDto.productId,
                });

                const unitPrice = restaurantProduct?.priceOverride || product.basePrice;
                const totalPrice = unitPrice * itemDto.quantity;
                subtotal += totalPrice;

                orderItems.push({
                    product,
                    qty: itemDto.quantity,
                    unitPrice,
                    totalPrice,
                    customizations: itemDto.customizations,
                } as OrderItem);
            }

            const tax = subtotal * 0.1; // 10% tax - make configurable
            const deliveryFee = dto.orderType === 'delivery' ? 5.0 : 0; // Make configurable
            const total = subtotal + tax + deliveryFee;

            // Create order
            const order = this.orderRepo.create({
                user,
                restaurant,
                totalAmount: total,
                status: OrderStatus.CREATED,

                pickupTime: new Date(),
                payment: null,
                delivery: null,

                tip: 0,

                orderType: dto.orderType,
                deliveryFee,
                meta: { notes: dto.notes },
            });

            em.persist(order);

            // Create order items
            for (const itemData of orderItems) {
                const orderItem = this.orderItemRepo.create({
                    order,
                    product: itemData.product,
                    qty: itemData.qty,
                    unitPrice: itemData.unitPrice,
                    totalPrice: itemData.totalPrice,
                    customizations: itemData.customizations,
                });
                em.persist(orderItem);
            }

            await em.flush();

            await this.orderStockService.consumeStockForOrder(order.id, userId);

            return this.getOrder(order.id);
        });
    }

    @CreateRequestContext()
    async convertCartToOrder(userId: string, dto: ConvertCartToOrderDto): Promise<Order> {
        return this.em.transactional(async (em) => {
            const cart = await this.cartService.getCart(dto.cartId);

            if (!cart || cart.items.length === 0) {
                throw AppErrors.badRequest('Cart is empty');
            }

            const totals = await this.cartService.calculateCartTotal(dto.cartId);

            const isForDelivery = Boolean(dto.deliveryAddress)

            const stockCheck = await this.orderStockService.checkOrderStockAvailability(
                cart.restaurant.id,
                cart.items.getItems().map((item) => ({
                    productId: item.product.id,
                    quantity: item.qty,
                    isForDelivery
                })),
            );

            if (!stockCheck.available) {
                throw AppErrors.outOfStock(JSON.stringify(stockCheck.unavailableItems));
            }

            const user = await em.findOneOrFail(User, userId);

            // Create order
            const order = this.orderRepo.create({
                user,
                restaurant: cart.restaurant,
                status: OrderStatus.CREATED,
                orderType: dto.orderType,
                totalAmount: totals.subtotal,
                deliveryFee: 0, //totals.deliveryFee,
                meta: { notes: dto.notes, convertedFromCart: cart.id },
            });

            em.persist(order);

            // Create order items from cart items
            for (const cartItem of cart.items.getItems()) {
                const orderItem = this.orderItemRepo.create({
                    order,
                    product: cartItem.product,
                    qty: cartItem.qty,
                    unitPrice: cartItem.priceAtAdd,
                    totalPrice: cartItem.priceAtAdd * cartItem.qty,
                    customizations: cartItem.meta,
                });
                em.persist(orderItem);
            }

            await em.flush();

            await this.orderStockService.consumeStockForOrder(order.id, userId);

            await this.cartService.deactivateCart(cart.id);

            return this.getOrder(order.id);
        });
    }

    async getOrder(orderId: string): Promise<Order> {
        return this.orderRepo.findOneOrFail(
            orderId,
            { populate: ['items.product', 'user', 'restaurant'] },
        );
    }

    async getUserOrders(
        userId: string,
        options?: {
            restaurantId?: string;
            status?: string;
            limit?: number;
            offset?: number;
        },
    ): Promise<{ orders: Order[]; total: number }> {
        const where: any = { user: userId };

        if (options?.restaurantId) {
            where.restaurant = options.restaurantId;
        }
        if (options?.status) {
            where.status = options.status;
        }

        const [orders, total] = await this.orderRepo.findAndCount(where, {
            populate: ['restaurant', 'items.product'],
            orderBy: { createdAt: 'DESC' },
            limit: options?.limit || 50,
            offset: options?.offset || 0,
        });

        return { orders, total };
    }

    async getRestaurantOrders(
        restaurantId: string,
        options?: {
            status?: string;
            orderType?: string;
            startDate?: Date;
            endDate?: Date;
            limit?: number;
            offset?: number;
        },
    ): Promise<{ orders: Order[]; total: number }> {
        const where: any = { restaurant: restaurantId };

        if (options?.status) {
            where.status = options.status;
        }
        if (options?.orderType) {
            where.orderType = options.orderType;
        }
        if (options?.startDate || options?.endDate) {
            where.createdAt = {};
            if (options.startDate) where.createdAt.$gte = options.startDate;
            if (options.endDate) where.createdAt.$lte = options.endDate;
        }

        const [orders, total] = await this.orderRepo.findAndCount(where, {
            populate: ['user', 'items.product'],
            orderBy: { createdAt: 'DESC' },
            limit: options?.limit || 50,
            offset: options?.offset || 0,
        });

        return { orders, total };
    }

    /**
   * Update order status
   */
    async updateOrderStatus(
        userId: string,
        dto: UpdateOrderStatusDto,
    ): Promise<Order> {
        const order = await this.orderRepo.findOneOrFail(dto.orderId);

        const oldStatus = order.status;
        order.status = dto.status as OrderStatus;

        // Track status changes in metadata
        if (!order.meta) {
            order.meta = {};
        }
        if (!order.meta.statusHistory) {
            order.meta.statusHistory = [];
        }
        order.meta.statusHistory.push({
            from: oldStatus,
            to: dto.status,
            timestamp: new Date(),
            userId: userId,
            notes: dto.notes,
        });

        // TODO update in delivery entity
        // if (dto.status === 'delivered') {
        //     order.actualDeliveryTime = new Date();
        // }

        await this.em.flush();
        return this.getOrder(dto.orderId);
    }

    async cancelOrder(userId: string, dto: CancelOrderDto): Promise<Order> {
        return this.em.transactional(async (em) => {
            const order = await this.orderRepo.findOneOrFail(dto.orderId);

            if ([OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(order.status)) {
                throw AppErrors.invalidOrderStatus(`Cannot cancel ${order.status} order`);
            }

            order.status = OrderStatus.CANCELLED;

            if (!order.meta) {
                order.meta = {};
            }
            order.meta.cancellationReason = dto.reason;
            order.meta.cancelledBy = userId;
            order.meta.cancelledAt = new Date();

            await em.flush();

            if (dto.refundStock !== false) {
                await this.orderStockService.refundStockForOrder(
                    dto.orderId,
                    dto.reason,
                    userId,
                );
            }

            return this.getOrder(dto.orderId);
        });
    }

    @CreateRequestContext()
    async refundOrder(userId: string, dto: RefundOrderDto): Promise<Order> {
        return this.em.transactional(async (em) => {
            const order = await this.orderRepo.findOneOrFail(dto.orderId);

            if (!order.meta) {
                order.meta= {};
            }
            if (!order.meta.refunds) {
                order.meta.refunds = [];
            }

            order.meta.refunds.push({
                reason: dto.reason,
                refundedBy: userId,
                refundedAt: new Date(),
                itemIds: dto.itemIds || 'all',
            });

            await em.flush();

            // Refund stock if requested (default true)
            if (dto.refundStock !== false) {
                await this.orderStockService.refundStockForOrder(
                    dto.orderId,
                    dto.reason,
                    userId,
                    dto.itemIds,
                );
            }

            return this.getOrder(dto.orderId);
        });
    }

    async getOrderStatistics(
        restaurantId: string,
        startDate: Date,
        endDate: Date,
    ): Promise<{
        totalOrders: number;
        totalRevenue: number;
        averageOrderValue: number;
        ordersByStatus: Record<string, number>;
        ordersByType: Record<string, number>;
    }> {
        const orders = await this.orderRepo.find({
            restaurant: restaurantId,
            createdAt: { $gte: startDate, $lte: endDate },
        });

        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        const ordersByStatus: Record<string, number> = {};
        const ordersByType: Record<string, number> = {};

        for (const order of orders) {
            ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1;
            ordersByType[order.orderType] = (ordersByType[order.orderType] || 0) + 1;
        }

        return {
            totalOrders,
            totalRevenue: Number(totalRevenue.toFixed(2)),
            averageOrderValue: Number(averageOrderValue.toFixed(2)),
            ordersByStatus,
            ordersByType,
        };
    }

    async getOrderWithStockDetails(orderId: string): Promise<{
        order: Order;
        stockConsumption: Array<{
            productName: string;
            supplyItemName: string;
            quantityConsumed: number;
            unit: string;
        }>;
    }> {
        const order = await this.getOrder(orderId);
        const stockConsumption = [];

        for (const orderItem of order.items.getItems()) {
            const ingredients = await this.em.find(
                ProductIngredient,
                { product: orderItem.product.id },
                { populate: ['supplyItem'] },
            );

            const packaging = await this.em.find(
                ProductPackaging,
                {
                    product: orderItem.product.id,
                    ...(order.orderType === 'delivery'
                        ? { isRequiredForDelivery: true }
                        : { isRequiredForLounge: true }),
                },
                { populate: ['packagingItem'] },
            );

            for (const ingredient of ingredients) {
                stockConsumption.push({
                    productName: orderItem.product.name,
                    supplyItemName: ingredient.supplyItem.name,
                    quantityConsumed: ingredient.quantity * orderItem.qty,
                    unit: ingredient.unit,
                });
            }

            for (const pkg of packaging) {
                stockConsumption.push({
                    productName: orderItem.product.name,
                    supplyItemName: pkg.packagingItem.name,
                    quantityConsumed: pkg.quantity * orderItem.qty,
                    unit: pkg.packagingItem.unit,
                });
            }
        }

        return {
            order,
            stockConsumption,
        };
    }
}
