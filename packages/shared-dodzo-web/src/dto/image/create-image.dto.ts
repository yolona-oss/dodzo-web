import { IsOptional, IsString, Length, IsUrl, IsJSON } from 'class-validator';
export class CreateImageDto {
    @IsOptional()
    @IsString()
    @Length(1,255)
    blankType?: string;

    @IsString()
    @Length(1,255)
    uploader: string;

    @IsJSON()
    uploaderData: any;

    @IsString()
    @IsUrl()
    url: string;
}
export class UpdateImageDto extends CreateImageDto {}
