import { IsString, IsUUID, Length } from 'class-validator';
export class CreateCategoryDto {
    @IsString()
    @Length(1,255)
    name: string;

    @IsUUID()
    imageId?: string
}
export class UpdateCategoryDto extends CreateCategoryDto {}
