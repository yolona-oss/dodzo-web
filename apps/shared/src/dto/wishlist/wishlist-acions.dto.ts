export class AddWishlistItemDto {
    wishlistId: string;
    productId: string;
    notes?: string;
    notifyOnAvailable?: boolean;
}

export class RemoveWishlistItemDto {
    wishlistItemId: string;
}
