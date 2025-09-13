import { IsInt, IsUUID, Min } from 'class-validator';
export class AddToWishlistDto {
    @IsUUID()
    productId: string;

    @IsUUID()
    organizationId: string;
}

export class RemoveFromWishlistDto {
    @IsUUID()
    productId: string;
}

export class MoveToCartDto {
    @IsUUID()
    productId: string;

    @IsUUID()
    organizationId: string;

    @IsInt()
    @Min(1)
    quantity: number;
}
