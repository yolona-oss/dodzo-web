import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
export class PaginationDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    offset?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 20;

    @IsOptional()
    @IsString()
    search?: string;
}

export class PaginatedResponseDto<T> {
    data: T[];
    pagination: PaginationDto;
    overallCount: number
}

export const DefaultedPagination: PaginationDto = {
    offset: 1,
    limit: 10
}
