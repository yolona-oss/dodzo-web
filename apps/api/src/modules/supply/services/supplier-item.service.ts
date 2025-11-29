import { CreateSupplierItemDto, UpdateSupplierItemDto } from "@dodzo-web/shared";
import { Supplier, SupplierItem, SupplyItem } from "@entities/index";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { AppErrors } from "common/error";

@Injectable()
export class SupplierItemService {
    constructor(
        @InjectRepository(SupplierItem)
        private readonly supplierItemRepo: EntityRepository<SupplierItem>,
        @InjectRepository(Supplier)
        private readonly supplierRepo: EntityRepository<Supplier>,
        @InjectRepository(SupplyItem)
        private readonly supplyItemRepo: EntityRepository<SupplyItem>,
        private readonly em: EntityManager,
    ) {}

    async createSupplierItem(dto: CreateSupplierItemDto): Promise<SupplierItem> {
        const supplier = await this.supplierRepo.findOneOrFail(dto.supplierId);
        const supplyItem = await this.supplyItemRepo.findOneOrFail(dto.supplyItemId);

        const existing = await this.supplierItemRepo.findOne({
            supplier: dto.supplierId,
            supplyItem: dto.supplyItemId,
        });

        if (existing) {
            throw AppErrors.badRequest('This supply item is already linked to this supplier');
        }

        const supplierItem = this.supplierItemRepo.create({
            supplier,
            supplyItem,
            supplierSku: dto.supplierSku,
            unitPrice: dto.unitPrice,
            currency: dto.currency || 'USD',
            minimumOrderQuantity: dto.minimumOrderQuantity,
            leadTimeDays: dto.leadTimeDays,
            isPreferred: dto.isPreferred ?? false,
            isActive: true,
        });

        await this.em.persistAndFlush(supplierItem);
        return supplierItem;
    }

    async getSupplierItem(supplierItemId: string): Promise<SupplierItem> {
        const supplierItem = await this.supplierItemRepo.findOne(
            supplierItemId,
            { populate: ['supplier', 'supplyItem'] },
        );

        if (!supplierItem) {
            throw AppErrors.dbEntityNotFound(`Supplier item with ID ${supplierItemId} not found`);
        }

        return supplierItem;
    }

    async updateSupplierItem(
        supplierItemId: string,
        dto: UpdateSupplierItemDto,
    ): Promise<SupplierItem> {
        const supplierItem = await this.supplierItemRepo.findOneOrFail(supplierItemId);

        if (dto.supplierSku !== undefined) supplierItem.supplierSku = dto.supplierSku;
        if (dto.unitPrice !== undefined) supplierItem.unitPrice = dto.unitPrice;
        if (dto.currency !== undefined) supplierItem.currency = dto.currency;
        if (dto.minimumOrderQuantity !== undefined) {
            supplierItem.minimumOrderQuantity = dto.minimumOrderQuantity;
        }
        if (dto.leadTimeDays !== undefined) supplierItem.leadTimeDays = dto.leadTimeDays;
        if (dto.isPreferred !== undefined) supplierItem.isPreferred = dto.isPreferred;
        if (dto.isActive !== undefined) supplierItem.isActive = dto.isActive;

        await this.em.flush();
        return this.getSupplierItem(supplierItemId);
    }

    async deleteSupplierItem(supplierItemId: string): Promise<void> {
        const supplierItem = await this.supplierItemRepo.findOneOrFail(supplierItemId);
        await this.em.removeAndFlush(supplierItem);
    }

    async setPreferredSupplier(
        supplierItemId: string,
    ): Promise<SupplierItem> {
        return this.em.transactional(async (em) => {
            const supplierItem = await this.supplierItemRepo.findOneOrFail(
                supplierItemId,
                { populate: ['supplyItem'] },
            );

            const otherSuppliers = await this.supplierItemRepo.find({
                supplyItem: supplierItem.supplyItem.id,
                id: { $ne: supplierItemId },
                isPreferred: true,
            });

            for (const other of otherSuppliers) {
                other.isPreferred = false;
            }

            supplierItem.isPreferred = true;
            await em.flush();

            return supplierItem;
        });
    }

    async compareSuppliers(supplyItemId: string): Promise<
    Array<{
        supplierId: string;
        supplierName: string;
        unitPrice: number;
        currency: string;
        leadTimeDays?: number;
        minimumOrderQuantity?: number;
        isPreferred: boolean;
    }>
    > {
        const supplierItems = await this.supplierItemRepo.find(
            { supplyItem: supplyItemId, isActive: true },
            { populate: ['supplier'], orderBy: { unitPrice: 'ASC' } },
        );

        return supplierItems.map((si) => ({
            supplierId: si.supplier.id,
            supplierName: si.supplier.name,
            unitPrice: si.unitPrice,
            currency: si.currency,
            leadTimeDays: si.leadTimeDays,
            minimumOrderQuantity: si.minimumOrderQuantity,
            isPreferred: si.isPreferred,
        }));
    }
}
