import { IsUUID, IsInt, Min, IsOptional } from 'class-validator';
export class AddToCartDto {
    @IsUUID()
    productId: string;

    @IsUUID()
    organizationId: string;

    @IsInt()
    @Min(1)
    @IsOptional()
    quantity: number;
}

export class RemoveFromCartDto {
    @IsUUID()
    productId: string;
}

export class UpdateCartDto {
    @IsUUID()
    productId: string;

    @IsInt()
    @Min(1)
    quantity: number;
}
