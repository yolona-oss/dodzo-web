import { SupplyOrderStatus } from "../../types/supply/supply-order-status.type";

export class CreateSupplyOrderDto {
    supplierId: string;
    restaurantId: string;
    expectedDeliveryDate?: Date;
    notes?: string;
    items: Array<{
        supplierItemId: string;
        quantity: number;
    }>;
}

export class UpdateSupplyOrderDto {
    supplyOrderId: string
    status?: SupplyOrderStatus;
    expectedDeliveryDate?: Date;
    actualDeliveryDate?: Date;
    notes?: string;
    invoiceNumber?: string;
}

export class ReceiveSupplyOrderDto {
    supplyOrderId: string;
    items: Array<{
        supplyOrderItemId: string;
        quantityReceived: number;
        batchNumber?: string;
        expirationDate?: Date;
    }>;
    actualDeliveryDate?: Date;
    receivedBy: string;
}
