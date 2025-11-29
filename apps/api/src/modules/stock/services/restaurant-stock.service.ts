import { StockAdjustmentDto, StockMovementType } from "@dodzo-web/shared";
import { Restaurant, RestaurantBatch, RestaurantStock, StockMovement, SupplyItem } from "@entities/index";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository, raw } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { AppErrors } from "common/error";

@Injectable()
export class RestaurantStockService {
    constructor(
        @InjectRepository(RestaurantStock)
        private readonly restaurantStockRepo: EntityRepository<RestaurantStock>,
        @InjectRepository(RestaurantBatch)
        private readonly restaurantBatchRepo: EntityRepository<RestaurantBatch>,
        @InjectRepository(StockMovement)
        private readonly movementRepo: EntityRepository<StockMovement>,
        @InjectRepository(SupplyItem)
        private readonly supplyItemRepo: EntityRepository<SupplyItem>,
        private readonly em: EntityManager,
    ) {}

    async getOrCreateRestaurantStock(
        restaurantId: string,
        supplyItemId: string,
    ): Promise<RestaurantStock> {
        let stock = await this.restaurantStockRepo.findOne({
            restaurant: restaurantId,
            supplyItem: supplyItemId,
        });

        if (!stock) {
            const supplyItem = await this.supplyItemRepo.findOneOrFail(supplyItemId);
            const restaurant = await this.em.findOneOrFail(Restaurant, restaurantId);

            stock = this.restaurantStockRepo.create({
                restaurant,
                supplyItem,
                currentStock: 0,
                minStockLevel: 10, // Default, should be configurable
                maxStockLevel: 1000,
                reorderQuantity: 50,
            });

            await this.em.persistAndFlush(stock);
        }

        return stock;
    }

    /**
   * Get current stock level for a restaurant and supply item
   */
    async getCurrentStock(
        restaurantId: string,
        supplyItemId: string,
    ): Promise<number> {
        const stock = await this.restaurantStockRepo.findOne({
            restaurant: restaurantId,
            supplyItem: supplyItemId,
        });

        return stock?.currentStock || 0;
    }

    /**
   * Check if stock is available for consumption
   */
    async isStockAvailable(
        restaurantId: string,
        supplyItemId: string,
        requiredQuantity: number,
    ): Promise<boolean> {
        const currentStock = await this.getCurrentStock(restaurantId, supplyItemId);
        return currentStock >= requiredQuantity;
    }

    /**
   * Get items below minimum stock level (for reorder alerts)
   */
    async getLowStockItems(restaurantId: string): Promise<RestaurantStock[]> {
        return this.restaurantStockRepo.find(
            {
                restaurant: restaurantId,
                currentStock: { $lt: raw('minStockLevel') },
            },
            { populate: ['supplyItem'] },
        );
    }

    /**
   * Increment stock (receiving inventory)
   */
    async incrementStock(
        restaurantId: string,
        supplyItemId: string,
        quantity: number,
        dto: {
            referenceId?: string;
            referenceType?: string;
            userId?: string;
            notes?: string;
            batchNumber?: string;
            expirationDate?: Date;
            unitCost?: number;
        },
    ): Promise<RestaurantStock> {
        return this.em.transactional(async (em) => {
            const stock = await this.getOrCreateRestaurantStock(
                restaurantId,
                supplyItemId,
            );

            // Update stock quantity
            stock.currentStock += quantity;
            stock.lastRestockedAt = new Date();

            // Create batch if batch tracking is enabled
            if (dto.batchNumber) {
                const batch = this.restaurantBatchRepo.create({
                    batchNumber: dto.batchNumber,
                    restaurantStock: stock,
                    quantity: quantity,
                    remainingQuantity: quantity,
                    unitCost: dto.unitCost,
                    expirationDate: dto.expirationDate,
                    receivedDate: new Date(),
                    notes: dto.notes,
                });
                em.persist(batch);
            }

            // Record stock movement
            const movement = this.movementRepo.create({
                restaurantStock: stock,
                type: StockMovementType.PURCHASE,
                quantity: quantity,
                unit: stock.supplyItem.unit,
                referenceId: dto.referenceId,
                referenceType: dto.referenceType || 'manual_adjustment',
                reason: 'Stock received',
                userId: dto.userId,
                costPerUnit: dto.unitCost,
                movementDate: new Date(),
                notes: dto.notes,
            });

            em.persist(movement);
            await em.flush();

            return stock;
        });
    }

    /**
   * Decrement stock (using inventory) with FIFO/FEFO batch tracking
   */
    async decrementStock(
        restaurantId: string,
        supplyItemId: string,
        quantity: number,
        dto: {
            referenceId?: string;
            referenceType?: string;
            userId?: string;
            reason?: string;
            notes?: string;
            useFIFO?: boolean; // true = FIFO, false = FEFO (expiration-based)
        },
    ): Promise<RestaurantStock> {
        return this.em.transactional(async (em) => {
            const stock = await this.restaurantStockRepo.findOneOrFail(
                {
                    restaurant: restaurantId,
                    supplyItem: supplyItemId,
                },
                { populate: ['batches'] },
            );

            // Check if enough stock available
            if (stock.currentStock < quantity) {
                throw AppErrors.outOfStock(`Insufficient stock. Available: ${stock.currentStock}, Required: ${quantity}`)
            }

            let remainingToConsume = quantity;

            // Get batches sorted by FIFO or FEFO
            const batches = await this.restaurantBatchRepo.find(
                {
                    restaurantStock: stock.id,
                    remainingQuantity: { $gt: 0 },
                },
                {
                    orderBy: dto.useFIFO
                        ? { receivedDate: 'ASC' }
                        : { expirationDate: 'ASC', receivedDate: 'ASC' },
                },
            );

            // Consume from batches
            for (const batch of batches) {
                if (remainingToConsume <= 0) break;

                const consumeFromBatch = Math.min(
                    batch.remainingQuantity,
                    remainingToConsume,
                );

                batch.remainingQuantity -= consumeFromBatch;
                remainingToConsume -= consumeFromBatch;

                // Record movement for this batch
                const movement = this.movementRepo.create({
                    restaurantStock: stock,
                    batch: batch,
                    type: StockMovementType.USAGE,
                    quantity: -consumeFromBatch, // Negative for outgoing
                    unit: stock.supplyItem.unit,
                    referenceId: dto.referenceId,
                    referenceType: dto.referenceType || 'consumption',
                    reason: dto.reason || 'Stock consumed',
                    userId: dto.userId,
                    movementDate: new Date(),
                    notes: dto.notes,
                });
                em.persist(movement);
            }

            // Update total stock
            stock.currentStock -= quantity;

            await em.flush();

            return stock;
        });
    }

    /**
   * Adjust stock (manual correction)
   */
    async adjustStock(dto: StockAdjustmentDto): Promise<RestaurantStock> {
        return this.em.transactional(async (em) => {
            const stock = await this.getOrCreateRestaurantStock(
                dto.restaurantId,
                dto.supplyItemId,
            );

            const oldStock = stock.currentStock;
            stock.currentStock = dto.quantity;

            const movement = this.movementRepo.create({
                restaurantStock: stock,
                type: StockMovementType.ADJUSTMENT,
                quantity: dto.quantity - oldStock,
                unit: stock.supplyItem.unit,
                reason: dto.reason,
                userId: dto.userId,
                movementDate: new Date(),
                notes: dto.notes,
            });

            em.persist(movement);
            await em.flush();

            return stock;
        });
    }

    /**
   * Record waste
   */
    async recordWaste(
        restaurantId: string,
        supplyItemId: string,
        quantity: number,
        reason: string,
        userId?: string,
        notes?: string,
    ): Promise<void> {
        await this.decrementStock(restaurantId, supplyItemId, quantity, {
            referenceType: 'waste',
            reason: reason,
            userId: userId,
            notes: notes,
            useFIFO: false, // Use FEFO for waste (expire oldest first)
        });
    }

    /**
   * Get stock movement history
   */
    async getStockHistory(
        restaurantId: string,
        supplyItemId: string,
        options?: {
            startDate?: Date;
            endDate?: Date;
            movementType?: StockMovementType;
            limit?: number;
        },
    ): Promise<StockMovement[]> {
        const stock = await this.restaurantStockRepo.findOne({
            restaurant: restaurantId,
            supplyItem: supplyItemId,
        });

        if (!stock) return [];

        const where: any = { restaurantStock: stock.id };

        if (options?.startDate) {
            where.movementDate = { $gte: options.startDate };
        }
        if (options?.endDate) {
            where.movementDate = { ...where.movementDate, $lte: options.endDate };
        }
        if (options?.movementType) {
            where.type = options.movementType;
        }

        return this.movementRepo.find(where, {
            orderBy: { movementDate: 'DESC' },
            limit: options?.limit || 100,
            populate: ['batch'],
        });
    }

    /**
   * Get expiring items (for alerts)
   */
    async getExpiringItems(
        restaurantId: string,
        daysThreshold: number = 7,
    ): Promise<RestaurantBatch[]> {
        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

        return this.restaurantBatchRepo.find(
            {
                restaurantStock: {
                    restaurant: restaurantId,
                },
                expirationDate: {
                    $lte: thresholdDate,
                    $gte: new Date(),
                },
                remainingQuantity: { $gt: 0 },
            },
            {
                populate: ['restaurantStock.supplyItem', 'restaurantStock.restaurant'],
                orderBy: { expirationDate: 'ASC' },
            },
        );
    }
}
