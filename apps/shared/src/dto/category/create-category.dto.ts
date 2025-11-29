import { IsOptional, IsString, IsUUID, Length } from 'class-validator';
export class CreateCategoryDto {
    @IsString()
    @Length(1,255)
    name: string;

    @IsString()
    restaurantId: string;

    @IsUUID()
    imageId?: string

    @IsString()
    @IsOptional()
    description?: string;
}
export class UpdateCategoryDto extends CreateCategoryDto {}
