import { UnitOfMeasure } from "../stock";

export interface IProduct {
    id: string;
    name: string;
    description?: string;
    sku: string;
    basePrice: number;
    isActive: boolean;
    category: {
        id: string;
        name: string;
    };
    restaurant: {
        id: string;
        name: string;
    };
    ingredients: Array<{
        id: string;
        supplyItemId: string;
        quantity: number;
        unit: UnitOfMeasure;
        notes?: string;
    }>;
    packaging: Array<{
        id: string;
        packagingItemId: string;
        quantity: number;
        isRequiredForDelivery: boolean;
        isRequiredForLounge: boolean;
        notes?: string;
    }>;
    createdAt: Date;
    updatedAt: Date;
}
