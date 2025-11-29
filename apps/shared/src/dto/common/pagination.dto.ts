import { IsInt, IsOptional, IsString, Min } from 'class-validator';
export class PaginationDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    offset?: number = 1;

    @IsOptional()
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
