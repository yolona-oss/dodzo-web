import { IsString, Length, IsUUID } from 'class-validator';
export class CreateSubCategoryDto {
    @IsUUID()
    categoryId: string;

    @IsString()
    @Length(1,255)
    name: string;
}
export class UpdateSubCategoryDto extends CreateSubCategoryDto {}
