import { UnitOfMeasure } from "../../types/stock/unit-of-measure.type";

export interface CreateProductIngredientDto {
    productId: string;
    supplyItemId: string;
    quantity: number;
    unit: UnitOfMeasure
    notes?: string;
}

export interface UpdateProductIngredientDto {
    productId: string;
    supplyItemId: string;
    quantity: number;
    unit: UnitOfMeasure
    notes?: string;
}
