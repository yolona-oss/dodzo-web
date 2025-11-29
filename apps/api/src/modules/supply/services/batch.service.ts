import { Batch, RestaurantBatch, SupplyItem, SupplyOrder } from "@entities/index";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { AppErrors } from "common/error";

@Injectable()
export class BatchService {
    constructor(
        @InjectRepository(Batch)
        private readonly batchRepo: EntityRepository<Batch>,
        @InjectRepository(RestaurantBatch)
        private readonly restaurantBatchRepo: EntityRepository<RestaurantBatch>,
        @InjectRepository(SupplyItem)
        private readonly supplyItemRepo: EntityRepository<SupplyItem>,
        @InjectRepository(SupplyOrder)
        private readonly supplyOrderRepo: EntityRepository<SupplyOrder>,
        private readonly em: EntityManager,
    ) {}

    async createBatch(dto: {
        batchNumber: string;
        supplyItemId: string;
        supplyOrderId?: string;
        quantity: number;
        unitCost?: number;
        expirationDate?: Date;
        notes?: string;
    }): Promise<Batch> {
        const supplyItem = await this.supplyItemRepo.findOneOrFail(dto.supplyItemId);
        const supplyOrder = dto.supplyOrderId
            ? await this.supplyOrderRepo.findOneOrFail(dto.supplyOrderId)
            : undefined;

        const batch = this.batchRepo.create({
            batchNumber: dto.batchNumber,
            supplyItem,
            supplyOrder,
            quantity: dto.quantity,
            remainingQuantity: dto.quantity,
            unitCost: dto.unitCost,
            expirationDate: dto.expirationDate,
            receivedDate: new Date(),
            notes: dto.notes,
        });

        await this.em.persistAndFlush(batch);
        return batch;
    }

    async getBatch(batchId: string): Promise<Batch> {
        const batch = await this.batchRepo.findOne(
            batchId,
            { populate: ['supplyItem', 'supplyOrder', 'restaurantBatches.restaurantStock.restaurant'] },
        );

        if (!batch) {
            throw AppErrors.dbEntityNotFound(`Batch with ID ${batchId} not found`)
        }

        return batch;
    }

    async getBatchesBySupplyItem(
        supplyItemId: string,
        options?: {
            includeEmpty?: boolean;
            sortBy?: 'receivedDate' | 'expirationDate';
        },
    ): Promise<Batch[]> {
        const where: any = { supplyItem: supplyItemId };

        if (!options?.includeEmpty) {
            where.remainingQuantity = { $gt: 0 };
        }

        const orderBy =
            options?.sortBy === 'expirationDate'
                ? { expirationDate: 'ASC', receivedDate: 'ASC' }
                : { receivedDate: 'DESC' };

        return this.batchRepo.find(where, {
            populate: ['supplyItem'],
            orderBy,
        });
    }

    async getExpiringBatches(daysThreshold: number = 7): Promise<Batch[]> {
        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

        return this.batchRepo.find(
            {
                expirationDate: {
                    $lte: thresholdDate,
                    $gte: new Date(),
                },
                remainingQuantity: { $gt: 0 },
            },
            {
                populate: ['supplyItem'],
                orderBy: { expirationDate: 'ASC' },
            },
        );
    }

    async getExpiredBatches(): Promise<Batch[]> {
        return this.batchRepo.find(
            {
                expirationDate: { $lt: new Date() },
                remainingQuantity: { $gt: 0 },
            },
            {
                populate: ['supplyItem'],
                orderBy: { expirationDate: 'ASC' },
            },
        );
    }

    async updateBatch(
        batchId: string,
        dto: {
            remainingQuantity?: number;
            expirationDate?: Date;
            notes?: string;
        },
    ): Promise<Batch> {
        const batch = await this.batchRepo.findOneOrFail(batchId);

        if (dto.remainingQuantity !== undefined) {
            batch.remainingQuantity = dto.remainingQuantity;
        }
        if (dto.expirationDate !== undefined) {
            batch.expirationDate = dto.expirationDate;
        }
        if (dto.notes !== undefined) {
            batch.notes = dto.notes;
        }

        await this.em.flush();
        return this.getBatch(batchId);
    }

    async depleteBatch(batchId: string): Promise<Batch> {
        const batch = await this.batchRepo.findOneOrFail(batchId);
        batch.remainingQuantity = 0;
        await this.em.flush();
        return batch;
    }
}
