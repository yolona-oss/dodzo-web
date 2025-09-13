import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';

export class UpdateProductStockDto {
    @IsOptional()
    @IsInt()
    @Min(0)
    count?: number;

    @IsOptional()
    @IsBoolean()
    isInfinite?: boolean;
}
