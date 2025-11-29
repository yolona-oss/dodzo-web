import { RestaurantStock, SupplierItem, SupplyItem } from "@entities/index";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import {
    CreateSupplyItemDto,
    SupplyItemType,
    UpdateSupplyItemDto
} from "@dodzo-web/shared";
import { AppErrors } from "common/error";

@Injectable()
export class SupplyItemService {
    constructor(
        @InjectRepository(SupplyItem)
        private readonly supplyItemRepo: EntityRepository<SupplyItem>,
        @InjectRepository(SupplierItem)
        private readonly supplierItemRepo: EntityRepository<SupplierItem>,
        @InjectRepository(RestaurantStock)
        private readonly restaurantStockRepo: EntityRepository<RestaurantStock>,
        private readonly em: EntityManager,
    ) {}

    async createSupplyItem(dto: CreateSupplyItemDto): Promise<SupplyItem> {
        // Check if SKU already exists
        const existingItem = await this.supplyItemRepo.findOne({ sku: dto.sku });
        if (existingItem) {
            throw AppErrors.badRequest(`Supply item with SKU ${dto.sku} already exists`);
        }

        const supplyItem = this.supplyItemRepo.create({
            name: dto.name,
            description: dto.description,
            sku: dto.sku,
            type: dto.type,
            unit: dto.unit,
            storageInstructions: dto.storageInstructions,
            shelfLife: dto.shelfLife,
            isActive: true,
        });

        await this.em.persistAndFlush(supplyItem);
        return supplyItem;
    }

    async getSupplyItem(supplyItemId: string): Promise<SupplyItem> {
        const supplyItem = await this.supplyItemRepo.findOne(
            supplyItemId,
            {
                populate: [
                    'supplierRelations.supplier',
                    'usedInCompositions.complexIngredient',
                    'usedInProducts.product',
                ],
            },
        );

        if (!supplyItem) {
            throw AppErrors.dbEntityNotFound(`Supply item with ID ${supplyItemId} not found`);
        }

        return supplyItem;
    }

    async getSupplyItems(options?: {
        type?: SupplyItemType;
        isActive?: boolean;
        search?: string;
        limit?: number;
        offset?: number;
    }): Promise<{ items: SupplyItem[]; total: number }> {
        const where: any = {};

        if (options?.type) {
            where.type = options.type;
        }

        if (options?.isActive !== undefined) {
            where.isActive = options.isActive;
        }

        if (options?.search) {
            where.$or = [
                { name: { $like: `%${options.search}%` } },
                { description: { $like: `%${options.search}%` } },
                { sku: { $like: `%${options.search}%` } },
            ];
        }

        const [items, total] = await this.supplyItemRepo.findAndCount(where, {
            orderBy: { name: 'ASC' },
            limit: options?.limit || 50,
            offset: options?.offset || 0,
        });

        return { items, total };
    }

    async updateSupplyItem(
        supplyItemId: string,
        dto: UpdateSupplyItemDto,
    ): Promise<SupplyItem> {
        const supplyItem = await this.supplyItemRepo.findOneOrFail(supplyItemId);

        if (dto.name !== undefined) supplyItem.name = dto.name;
        if (dto.description !== undefined) supplyItem.description = dto.description;
        if (dto.sku !== undefined) {
            const existingItem = await this.supplyItemRepo.findOne({
                sku: dto.sku,
                id: { $ne: supplyItemId },
            });
            if (existingItem) {
                throw AppErrors.badRequest(`Supply item with SKU ${dto.sku} already exists`);
            }
            supplyItem.sku = dto.sku;
        }
        if (dto.type !== undefined) supplyItem.type = dto.type;
        if (dto.unit !== undefined) supplyItem.unit = dto.unit;
        if (dto.storageInstructions !== undefined) {
            supplyItem.storageInstructions = dto.storageInstructions;
        }
        if (dto.shelfLife !== undefined) supplyItem.shelfLife = dto.shelfLife;
        if (dto.isActive !== undefined) supplyItem.isActive = dto.isActive;

        await this.em.flush();
        return this.getSupplyItem(supplyItemId);
    }

    async deleteSupplyItem(supplyItemId: string): Promise<void> {
        const supplyItem = await this.supplyItemRepo.findOneOrFail(supplyItemId);
        supplyItem.isActive = false;
        await this.em.flush();
    }

    async getSupplyItemStock(supplyItemId: string): Promise<
    Array<{
        restaurantId: string;
        restaurantName: string;
        currentStock: number;
        minStockLevel: number;
        unit: string;
    }>
    > {
        const stocks = await this.restaurantStockRepo.find(
            { supplyItem: supplyItemId },
            { populate: ['restaurant', 'supplyItem'] },
        );

        return stocks.map((stock) => ({
            restaurantId: stock.restaurant.id,
            restaurantName: stock.restaurant.name,
            currentStock: stock.currentStock,
            minStockLevel: stock.minStockLevel,
            unit: stock.supplyItem.unit,
        }));
    }

    async getSupplyItemSuppliers(supplyItemId: string): Promise<SupplierItem[]> {
        return this.supplierItemRepo.find(
            { supplyItem: supplyItemId, isActive: true },
            {
                populate: ['supplier'],
                orderBy: { isPreferred: 'DESC', unitPrice: 'ASC' },
            },
        );
    }

    async getSupplyItemsByType(type: SupplyItemType): Promise<SupplyItem[]> {
        return this.supplyItemRepo.find(
            { type, isActive: true },
            { orderBy: { name: 'ASC' } },
        );
    }
}
