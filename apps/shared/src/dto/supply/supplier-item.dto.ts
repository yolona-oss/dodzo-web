export class CreateSupplierItemDto {
    supplierId: string;
    supplyItemId: string;
    supplierSku?: string;
    unitPrice: number;
    currency?: string;
    minimumOrderQuantity?: number;
    leadTimeDays?: number;
    isPreferred?: boolean;
}

export class UpdateSupplierItemDto {
    supplierSku?: string;
    unitPrice?: number;
    currency?: string;
    minimumOrderQuantity?: number;
    leadTimeDays?: number;
    isPreferred?: boolean;
    isActive?: boolean;
}
