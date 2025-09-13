import { IsArray, IsNumber, IsOptional, IsString, IsUUID, Length, Min } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @Length(1,255)
    title: string;

    @IsString()
    @Length(1,255)
    description: string;

    @IsString()
    @Length(1,255)
    sku: string;

    @IsUUID()
    primaryImageId: string;

    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true })
    imageIds?: string[];

    @IsNumber()
    @Min(0)
    price: number;

    @IsUUID()
    categoryId: string;

    @IsOptional()
    @IsUUID()
    subCategoryId: string;
}
export class UpdateProductDto extends CreateProductDto {}
