export interface CreateProductPackagingDto {
    productId: string;
    packagingItemId: string;
    quantity: number;
    isRequiredForDelivery?: boolean;
    isRequiredForLounge?: boolean;
    notes?: string;
}

export interface UpdateProductPackagingDto {
    quantity: number;
    isRequiredForDelivery?: boolean;
    isRequiredForLounge?: boolean;
    notes?: string;
}
