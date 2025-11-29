import { StockMovementType, UnitOfMeasure } from "@dodzo-web/shared/types";

export class CreateStockMovementDto {
    restaurantStockId: string;
    type: StockMovementType;
    quantity: number;
    referenceId?: string;
    referenceType?: string;
    reason?: string;
    userId?: string;
    notes?: string;
    batchId?: string;
}

export class StockAdjustmentDto {
    restaurantId: string;
    supplyItemId: string;
    quantity: number;
    reason: string;
    userId: string;
    notes?: string;
}

export class ConsumeStockDto {
    restaurantId: string;
    items: Array<{
        supplyItemId: string;
        quantity: number;
        unit: UnitOfMeasure;
    }>;
    referenceId: string;
    referenceType: string;
    userId?: string;
}

export class RefundStockDto {
    restaurantId: string;
    orderId: string;
    items: Array<{
        supplyItemId: string;
        quantity: number;
        unit: UnitOfMeasure;
    }>;
    reason: string;
    userId?: string;
}

export class TransferStockDto {
    fromRestaurantId: string;
    toRestaurantId: string;
    supplyItemId: string;
    quantity: number;
    unit: UnitOfMeasure;
    requestedBy: string;
    notes?: string;
}
