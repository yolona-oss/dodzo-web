import { IsBoolean, IsInt, IsOptional, IsUUID, Min } from 'class-validator';

export class CreateProductStockDto {
    @IsUUID()
    productId: string;

    @IsUUID()
    organizationId: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    count?: number;

    @IsBoolean()
    isInfinite: boolean;
}
