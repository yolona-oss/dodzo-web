import { SupplyItemType } from "../../types/supply/supply-item.type";
import { UnitOfMeasure } from "../../types/stock/unit-of-measure.type";

export class CreateSupplyItemDto {
    name: string;
    description?: string;
    sku: string;
    type: SupplyItemType;
    unit: UnitOfMeasure;
    storageInstructions?: Record<string, any>;
    shelfLife?: number;
}

export class UpdateSupplyItemDto {
    name?: string;
    description?: string;
    sku?: string;
    type?: SupplyItemType;
    unit?: UnitOfMeasure;
    isActive?: boolean;
    storageInstructions?: Record<string, any>;
    shelfLife?: number;
}
