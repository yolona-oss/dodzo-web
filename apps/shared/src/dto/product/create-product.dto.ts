import { IsArray, IsBoolean, IsNumber, IsOctal, IsOptional, IsString, IsUrl, IsUUID, Length, Min } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @Length(1,255)
    name: string;

    @IsString()
    @Length(1,255)
    description: string;

    @IsString()
    @Length(1,255)
    sku: string;

    @IsUrl()
    @IsOptional()
    imageUrl?: string

    @IsNumber()
    @Min(0)
    basePrice: number;

    @IsUUID()
    categoryId: string;

    @IsUUID()
    restaurantId: string;
}

export class UpdateProductDto extends CreateProductDto {

    @IsOctal()
    @IsBoolean()
    isActive?: boolean
}
