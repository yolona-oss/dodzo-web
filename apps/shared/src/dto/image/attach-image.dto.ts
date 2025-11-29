import { IsString } from 'class-validator';
// import { ImageTypeEnum } from '@dodzo-web/shared/enums';

export class AttachImageDto {
    @IsString()
    ownerType!: string;

    @IsString()
    ownerId!: string;
}
