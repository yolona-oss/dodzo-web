export class AddCartItemDto {
    cartId: string;
    productId: string;
    quantity: number;
    meta?: Record<string, any>;
    isForDelivery?: boolean;
}

export class UpdateCartItemDto {
    cartItemId: string;
    quantity?: number;
    meta?: Record<string, any>;
}

export class RemoveCartItemDto {
    cartItemId: string;
}
