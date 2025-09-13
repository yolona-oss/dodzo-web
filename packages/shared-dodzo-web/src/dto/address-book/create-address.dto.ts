import { IsString, Length } from 'class-validator';
export class CreateAddressDto {
    @IsString()
    @Length(1,255)
    coordinates: string;

    @IsString()
    @Length(1,255)
    address: string;

    @IsString()
    @Length(1,255)
    label: string;
}
export class UpdateAddressDto extends CreateAddressDto {}
