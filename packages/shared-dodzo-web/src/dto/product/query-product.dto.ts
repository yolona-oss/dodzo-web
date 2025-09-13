import { IsOptional, IsNumber, IsString, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { DEFAULT_REQUEST_PAGE, DEFAULT_REQUEST_PER_PAGE } from '../../constants';

export class QueryProductDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsUUID()
    categoryId?: string;

    @IsOptional()
    @IsUUID()
    subCategoryId?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    minPrice?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    maxPrice?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    offset: number = DEFAULT_REQUEST_PAGE;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    limit: number = DEFAULT_REQUEST_PER_PAGE;
}
