import { CreateSupplyOrderDto, CurrencyEnum, ReceiveSupplyOrderDto, SupplyOrderStatus, UpdateSupplyOrderDto } from "@dodzo-web/shared";
import { Restaurant, Supplier, SupplierItem, SupplyOrder, SupplyOrderItem } from "@entities/index";
import { InjectRepository } from "@mikro-orm/nestjs";
import { CreateRequestContext, EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { AppErrors } from "common/error";
import { RestaurantStockService } from "modules/stock/services/restaurant-stock.service";

@Injectable()
export class SupplyOrderService {
    constructor(
        @InjectRepository(SupplyOrder)
        private readonly supplyOrderRepo: EntityRepository<SupplyOrder>,
        @InjectRepository(SupplyOrderItem)
        private readonly supplyOrderItemRepo: EntityRepository<SupplyOrderItem>,
        @InjectRepository(SupplierItem)
        private readonly supplierItemRepo: EntityRepository<SupplierItem>,
        private readonly restaurantStockService: RestaurantStockService,
        private readonly em: EntityManager,
    ) {}

    @CreateRequestContext()
    async createSupplyOrder(dto: CreateSupplyOrderDto): Promise<SupplyOrder> {
        return this.em.transactional(async (em) => {
            const supplier = await em.findOneOrFail(Supplier, dto.supplierId);
            const restaurant = await em.findOneOrFail(Restaurant, dto.restaurantId);

            const orderNumber = `SO-${Date.now()}`;

            const supplyOrder = this.supplyOrderRepo.create({
                orderNumber,
                supplier,
                restaurant,
                currency: CurrencyEnum.DEFAULT,
                status: SupplyOrderStatus.DRAFT,
                orderDate: new Date(),
                expectedDeliveryDate: dto.expectedDeliveryDate,
                meta: dto.notes,
                totalAmount: 0,
            });

            let totalAmount = 0;

            for (const itemDto of dto.items) {
                const supplierItem = await this.supplierItemRepo.findOneOrFail(
                    itemDto.supplierItemId,
                    { populate: ['supplyItem'] },
                );

                const totalPrice = supplierItem.unitPrice * itemDto.quantity;
                totalAmount += totalPrice;

                const orderItem = this.supplyOrderItemRepo.create({
                    order: supplyOrder,
                    supplierItem,
                    quantityOrdered: itemDto.quantity,
                    unitPrice: supplierItem.unitPrice,
                    totalPrice,
                });

                em.persist(orderItem);
            }

            supplyOrder.totalAmount = totalAmount;
            em.persist(supplyOrder);
            await em.flush();

            return supplyOrder;
        });
    }

    async updateSupplyOrder(
        dto: UpdateSupplyOrderDto,
    ): Promise<SupplyOrder> {
        const order = await this.supplyOrderRepo.findOneOrFail(dto.supplyOrderId);

        if (dto.status) order.status = dto.status;
        if (dto.expectedDeliveryDate) order.expectedDeliveryDate = dto.expectedDeliveryDate;
        if (dto.actualDeliveryDate) order.actualDeliveryDate = dto.actualDeliveryDate;
        if (dto.notes) order.meta = dto.notes;
        if (dto.invoiceNumber) order.invoiceNumber = dto.invoiceNumber;

        await this.em.flush();
        return order;
    }

    async confirmSupplyOrder(orderId: string): Promise<SupplyOrder> {
        const order = await this.supplyOrderRepo.findOneOrFail(orderId);

        if (order.status !== SupplyOrderStatus.DRAFT) {
            throw AppErrors.badRequest('Only draft orders can be confirmed');
        }

        order.status = SupplyOrderStatus.CONFIRMED;
        order.orderDate = new Date();

        await this.em.flush();
        return order;
    }

    async receiveSupplyOrder(dto: ReceiveSupplyOrderDto): Promise<SupplyOrder> {
        return this.em.transactional(async (em) => {
            const order = await this.supplyOrderRepo.findOneOrFail(
                dto.supplyOrderId,
                { 
                    populate: ['items.supplierItem.supplyItem', 'restaurant', 'supplier'],
                },
            );

            if (order.status === SupplyOrderStatus.DELIVERED) {
                throw AppErrors.badRequest('Order already delivered');
            }

            // Process each received item
            for (const receivedItem of dto.items) {
                const orderItem = order.items
                .getItems()
                .find((item) => item.id === receivedItem.supplyOrderItemId);

                if (!orderItem) {
                    throw AppErrors.dbEntityNotFound(
                        `Order item ${receivedItem.supplyOrderItemId} not found`,
                    );
                }

                // Update received quantity
                orderItem.quantityReceived = receivedItem.quantityReceived;

                // Increment stock at restaurant
                await this.restaurantStockService.incrementStock(
                    order.restaurant.id,
                    orderItem.supplierItem.supplyItem.id,
                    receivedItem.quantityReceived,
                    {
                        referenceId: order.id,
                        referenceType: 'supply_order',
                        userId: dto.receivedBy,
                        batchNumber: receivedItem.batchNumber || `BATCH-${order.orderNumber}-${orderItem.id}`,
                        expirationDate: receivedItem.expirationDate,
                        unitCost: orderItem.unitPrice,
                        notes: `Received from ${order.supplier.name}`,
                    },
                );
            }

            // Update order status
            order.status = SupplyOrderStatus.DELIVERED;
            order.actualDeliveryDate = dto.actualDeliveryDate || new Date();

            await em.flush();
            return order;
        });
    }

    async cancelSupplyOrder(orderId: string, reason: string): Promise<SupplyOrder> {
        const order = await this.supplyOrderRepo.findOneOrFail(orderId);

        if (order.status === SupplyOrderStatus.DELIVERED) {
            throw AppErrors.badRequest('Cannot cancel delivered order');
        }

        order.status = SupplyOrderStatus.CANCELLED;
        order.meta = `${order.meta || ''}\nCancelled: ${reason}`;

        await this.em.flush();
        return order;
    }

    async getRestaurantOrders(
        restaurantId: string,
        status?: SupplyOrderStatus,
    ): Promise<SupplyOrder[]> {
        const where: any = { restaurant: restaurantId };
        if (status) where.status = status;

        return this.supplyOrderRepo.find(where, {
            populate: ['supplier', 'items.supplierItem.supplyItem'],
            orderBy: { createdAt: 'DESC' },
        });
    }

    async getPendingOrders(restaurantId?: string): Promise<SupplyOrder[]> {
        const where: any = {
            status: { $in: [SupplyOrderStatus.CONFIRMED, SupplyOrderStatus.SHIPPED] },
        };

        if (restaurantId) {
            where.restaurant = restaurantId;
        }

        return this.supplyOrderRepo.find(where, {
            populate: ['supplier', 'restaurant', 'items.supplierItem.supplyItem'],
            orderBy: { expectedDeliveryDate: 'ASC' },
        });
    }

    async getSupplyOrder(orderId: string): Promise<SupplyOrder> {
        return this.supplyOrderRepo.findOneOrFail(orderId, {
            populate: ['supplier', 'restaurant', 'items.supplierItem.supplyItem'],
        });
    }
}
