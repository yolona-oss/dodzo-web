import { Injectable } from '@nestjs/common';

import { CartService } from '../cart/cart.service';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from 'common/entities/Order.entity';
import { Repository } from 'typeorm';
import { OrderItemEntity } from 'common/entities/OrderItem.entity';
import { CustomerEntity } from 'common/entities/Customer.entity';
import { AddressBookEntity } from 'common/entities/AddressBook.entity';
import { AppErrors } from 'common/app-error';
import { OrganizationEntity } from 'common/entities/Organization.entity';
import { ProductStockService } from 'organization/stock/services/stock.service';
import { ProductStockSettingService } from 'organization/stock/services/stock-setting.service';
import { StockUtils } from 'organization/stock/stock.utils';
import { OrderStatus, PaginatedResponseDto, PaginationDto, UpdateOrderStatusDto } from '@dodzo-web/shared';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepo: Repository<OrderEntity>,

        @InjectRepository(OrderItemEntity)
        private readonly orderItemRepo: Repository<OrderItemEntity>,

        @InjectRepository(CustomerEntity)
        private readonly customerRepo: Repository<CustomerEntity>,

        @InjectRepository(AddressBookEntity)
        private readonly addressRepo: Repository<AddressBookEntity>,

        @InjectRepository(OrganizationEntity)
        private readonly orgRepo: Repository<OrganizationEntity>,

        private readonly cartService: CartService,
        private readonly stockService: ProductStockService,
        private readonly stockSettingService: ProductStockSettingService
    ) { }

    async findAll(dto: PaginationDto): Promise<PaginatedResponseDto<OrderEntity>> {
        const offset = dto.offset || 0;
        const limit = dto.limit || 10;
        const pagination = { offset, limit };

        const [entities, count] = await this.orderRepo.findAndCount({
            relations: ['customer', 'customer.user', 'items', 'items.product'],
            order: { createdAt: 'DESC' },
            take: pagination.limit,
            skip: pagination.offset,
        });

        return {
            data: entities,
            pagination,
            overallCount: count
        }
    }

    async findByCustomerId(customerId: string): Promise<OrderEntity[]> {
        return this.orderRepo.find({
            where: { customer: { id: customerId } },
            relations: ['items', 'items.product'],
            order: { createdAt: 'DESC' },
        });
    }

    async findByIdWithDetails(orderId: string): Promise<OrderEntity> {
        const order = await this.orderRepo.findOne({
            where: { id: orderId },
            relations: ['customer', 'customer.user', 'items', 'items.product'],
        });

        if (!order) {
            throw AppErrors.dbEntityNotFound("Order not found");
        }

        return order;
    }

    async updateStatus(orderId: string, dto: UpdateOrderStatusDto) {
        const order = await this.findByIdWithDetails(orderId);
        order.status = dto.status;
        return this.orderRepo.save(order);
    }

    async createFromCart(customerId: string): Promise<OrderEntity[]> {
        // // Validate cart
        // const cartValidation = await this.cartService.validateCart(customerId);
        // if (!cartValidation.valid) {
        //     throw AppErrors.validationError(`Cart validation failed: ${cartValidation.errors.join(', ')}`);
        // }
        //
        const cart = await this.cartService.findByCustomerId(customerId);
        if (!cart || cart.items.length === 0) {
            throw AppErrors.validationError('Cart is empty');
        }

        // Split items by organization
        const orgGroups = new Map<string, OrderItemEntity[]>();

        for (const item of cart.items) {
            const stock = await this.stockService.getStock(item.product.id, item.organization.id);
            const settings = await this.stockSettingService.getByOrg(item.organization.id);

            if (!StockUtils.hasSufficientStock(stock, item.quantity, settings)) {
                throw AppErrors.invalidRange('Not enough stock available');
            }

            // Decrease stock immediately
            await this.stockService.decreaseStock(item.product.id, item.organization.id, item.quantity);

            if (!orgGroups.has(item.organization.id)) {
                orgGroups.set(item.organization.id, []);
            }

            const orderItem = this.orderItemRepo.create({
                product: item.product,
                organization: item.organization,
                quantity: item.quantity,
            });

            orgGroups.get(item.organization.id)!.push(orderItem);
        }

        // Create separate orders
        const orders: OrderEntity[] = [];
        for (const [orgId, orderItems] of orgGroups.entries()) {
            const order = this.orderRepo.create({
                customer: cart.customer,
                producer: { id: orgId } as any,
                comment: "",
                items: orderItems,
                status: OrderStatus.Pending,
            });
            orders.push(await this.orderRepo.save(order));
        }

        return orders;
    }
}
