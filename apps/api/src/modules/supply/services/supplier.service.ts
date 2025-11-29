import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { EntityManager } from '@mikro-orm/core';
import { Supplier, SupplierItem, SupplyOrder } from 'entities';
import {
    CreateSupplierDto,
    SupplyOrderStatus,
    UpdateSupplierDto
} from '@dodzo-web/shared';

@Injectable()
export class SupplierService {
    constructor(
        @InjectRepository(Supplier)
        private readonly supplierRepo: EntityRepository<Supplier>,
        @InjectRepository(SupplierItem)
        private readonly supplierItemRepo: EntityRepository<SupplierItem>,
        @InjectRepository(SupplyOrder)
        private readonly supplyOrderRepo: EntityRepository<SupplyOrder>,
        private readonly em: EntityManager,
    ) {}

    async createSupplier(dto: CreateSupplierDto): Promise<Supplier> {
        const supplier = this.supplierRepo.create({
            name: dto.name,
            contactPerson: dto.contactPerson,
            email: dto.email,
            phone: dto.phone,
            address: dto.address,
            paymentTerms: dto.paymentTerms,
            meta: dto.meta,
            isActive: true,
        });

        await this.em.persistAndFlush(supplier);
        return supplier;
    }

    async getSupplier(supplierId: string): Promise<Supplier> {
        const supplier = await this.supplierRepo.findOne(
            supplierId,
            { populate: ['supplierItems.supplyItem', 'orders'] },
        );

        if (!supplier) {
            throw new NotFoundException(`Supplier with ID ${supplierId} not found`);
        }

        return supplier;
    }

    async getSuppliers(options?: {
        isActive?: boolean;
        search?: string;
        limit?: number;
        offset?: number;
    }): Promise<{ suppliers: Supplier[]; total: number }> {
        const where: any = {};

        if (options?.isActive !== undefined) {
            where.isActive = options.isActive;
        }

        if (options?.search) {
            where.$or = [
                { name: { $like: `%${options.search}%` } },
                { email: { $like: `%${options.search}%` } },
                { phone: { $like: `%${options.search}%` } },
            ];
        }

        const [suppliers, total] = await this.supplierRepo.findAndCount(where, {
            orderBy: { name: 'ASC' },
            limit: options?.limit || 50,
            offset: options?.offset || 0,
        });

        return { suppliers, total };
    }

    async updateSupplier(supplierId: string, dto: UpdateSupplierDto): Promise<Supplier> {
        const supplier = await this.supplierRepo.findOneOrFail(supplierId);

        if (dto.name !== undefined) supplier.name = dto.name;
        if (dto.contactPerson !== undefined) supplier.contactPerson = dto.contactPerson;
        if (dto.email !== undefined) supplier.email = dto.email;
        if (dto.phone !== undefined) supplier.phone = dto.phone;
        if (dto.address !== undefined) supplier.address = dto.address;
        if (dto.paymentTerms !== undefined) supplier.paymentTerms = dto.paymentTerms;
        if (dto.meta !== undefined) supplier.meta = dto.meta;
        if (dto.isActive !== undefined) supplier.isActive = dto.isActive;

        await this.em.flush();
        return this.getSupplier(supplierId);
    }

    async deleteSupplier(supplierId: string): Promise<void> {
        const supplier = await this.supplierRepo.findOneOrFail(supplierId);
        supplier.isActive = false;
        await this.em.flush();
    }

    async getSupplierItems(supplierId: string): Promise<SupplierItem[]> {
        return this.supplierItemRepo.find(
            { supplier: supplierId, isActive: true },
            { populate: ['supplyItem'], orderBy: { createdAt: 'DESC' } },
        );
    }

    async getSupplierOrders(
        supplierId: string,
        options?: {
            status?: string;
            startDate?: Date;
            endDate?: Date;
            limit?: number;
            offset?: number;
        },
    ): Promise<{ orders: SupplyOrder[]; total: number }> {
        const where: any = { supplier: supplierId };

        if (options?.status) {
            where.status = options.status;
        }

        if (options?.startDate || options?.endDate) {
            where.orderDate = {};
            if (options.startDate) where.orderDate.$gte = options.startDate;
            if (options.endDate) where.orderDate.$lte = options.endDate;
        }

        const [orders, total] = await this.supplyOrderRepo.findAndCount(where, {
            populate: ['restaurant'],
            orderBy: { createdAt: 'DESC' },
            limit: options?.limit || 50,
            offset: options?.offset || 0,
        });

        return { orders, total };
    }

    async getSupplierMetrics(supplierId: string): Promise<{
        totalOrders: number;
        totalSpent: number;
        averageLeadTime: number;
        onTimeDeliveryRate: number;
    }> {
        const orders = await this.supplyOrderRepo.find({
            supplier: supplierId,
            status: SupplyOrderStatus.DELIVERED,
        });

        const totalOrders = orders.length;
        const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

        let totalLeadTime = 0;
        let onTimeDeliveries = 0;

        for (const order of orders) {
            if (order.orderDate && order.actualDeliveryDate) {
                const leadTime = Math.ceil(
                    (order.actualDeliveryDate.getTime() - order.orderDate.getTime()) /
                        (1000 * 60 * 60 * 24),
                );
                totalLeadTime += leadTime;

                if (
                    order.expectedDeliveryDate &&
                        order.actualDeliveryDate <= order.expectedDeliveryDate
                ) {
                    onTimeDeliveries++;
                }
            }
        }

        return {
            totalOrders,
            totalSpent: Number(totalSpent.toFixed(2)),
            averageLeadTime: totalOrders > 0 ? Math.round(totalLeadTime / totalOrders) : 0,
            onTimeDeliveryRate:
            totalOrders > 0 ? Number(((onTimeDeliveries / totalOrders) * 100).toFixed(2)) : 0,
        };
    }
}
