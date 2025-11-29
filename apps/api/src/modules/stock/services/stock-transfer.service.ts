import { Restaurant, StockTransfer, SupplyItem } from "@entities/index";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { RestaurantStockService } from "./restaurant-stock.service";
import { TransferStockDto } from "@dodzo-web/shared";
import { AppErrors } from "common/error";

@Injectable()
export class StockTransferService {
    constructor(
        @InjectRepository(StockTransfer)
        private readonly transferRepo: EntityRepository<StockTransfer>,
        private readonly restaurantStockService: RestaurantStockService,
        private readonly em: EntityManager,
    ) {}

    /**
   * Create stock transfer request between restaurants
   */
    async createTransfer(dto: TransferStockDto): Promise<StockTransfer> {
        return this.em.transactional(async (em) => {
            // Check if source restaurant has enough stock
            const available = await this.restaurantStockService.isStockAvailable(
                dto.fromRestaurantId,
                dto.supplyItemId,
                dto.quantity,
            );

            if (!available) {
                throw AppErrors.outOfStock('Insufficient stock at source restaurant');
            }

            const transferNumber = `TR-${Date.now()}`;
            const fromRestaurant = await em.findOneOrFail(Restaurant, dto.fromRestaurantId);
            const toRestaurant = await em.findOneOrFail(Restaurant, dto.toRestaurantId);
            const supplyItem = await em.findOneOrFail(SupplyItem, dto.supplyItemId);

            const transfer = this.transferRepo.create({
                transferNumber,
                fromRestaurant,
                toRestaurant,
                supplyItem,
                quantity: dto.quantity,
                unit: dto.unit,
                requestedBy: dto.requestedBy,
                notes: dto.notes,
                status: 'pending',
            });

            await em.persistAndFlush(transfer);
            return transfer;
        });
    }

    /**
   * Approve and ship transfer
   */
    async shipTransfer(transferId: string, approvedBy: string): Promise<StockTransfer> {
        return this.em.transactional(async (em) => {
            const transfer = await this.transferRepo.findOneOrFail(transferId, {
                populate: ['fromRestaurant', 'toRestaurant', 'supplyItem'],
            });

            if (transfer.status !== 'pending') {
                throw AppErrors.badRequest('Transfer already processed');
            }

            // Decrement from source
            await this.restaurantStockService.decrementStock(
                transfer.fromRestaurant.id,
                transfer.supplyItem.id,
                transfer.quantity,
                {
                    referenceId: transfer.id,
                    referenceType: 'transfer_out',
                    userId: approvedBy,
                    reason: `Transfer to ${transfer.toRestaurant.name}`,
                },
            );

            transfer.status = 'shipped';
            transfer.approvedBy = approvedBy;
            transfer.shippedDate = new Date();

            await em.flush();
            return transfer;
        });
    }

    /**
   * Receive transfer at destination
   */
    async receiveTransfer(transferId: string, receivedBy: string): Promise<StockTransfer> {
        return this.em.transactional(async (em) => {
            const transfer = await this.transferRepo.findOneOrFail(transferId, {
                populate: ['fromRestaurant', 'toRestaurant', 'supplyItem'],
            });

            if (transfer.status !== 'shipped') {
                throw AppErrors.badRequest('Transfer must be shipped before receiving');
            }

            // Increment at destination
            await this.restaurantStockService.incrementStock(
                transfer.toRestaurant.id,
                transfer.supplyItem.id,
                transfer.quantity,
                {
                    referenceId: transfer.id,
                    referenceType: 'transfer_in',
                    userId: receivedBy,
                    notes: `Transfer from ${transfer.fromRestaurant.name}`,
                },
            );

            transfer.status = 'received';
            transfer.receivedDate = new Date();

            await em.flush();
            return transfer;
        });
    }

    /**
   * Cancel transfer (only if not yet shipped)
   */
    async cancelTransfer(transferId: string, reason: string): Promise<StockTransfer> {
        const transfer = await this.transferRepo.findOneOrFail(transferId);

        if (transfer.status !== 'pending') {
            throw AppErrors.badRequest('Can only cancel pending transfers');
        }

        transfer.status = 'cancelled';
        transfer.notes = `${transfer.notes || ''}\nCancelled: ${reason}`;

        await this.em.flush();
        return transfer;
    }
}
