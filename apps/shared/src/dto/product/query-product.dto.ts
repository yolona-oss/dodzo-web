import { IsOptional, IsNumber, IsString, IsUUID, Min } from 'class-validator';
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
    @IsNumber()
    @Min(0)
    minPrice?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    maxPrice?: number;

    @IsOptional()
    @IsNumber()
    @Min(1)
    offset: number = DEFAULT_REQUEST_PAGE;

    @IsOptional()
    @IsNumber()
    @Min(1)
    limit: number = DEFAULT_REQUEST_PER_PAGE;
}
