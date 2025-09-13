import { IsString, Length, IsUUID, IsInt, Min, IsOptional } from 'class-validator';
export class CreateOrganizationDto {
    @IsString()
    @Length(1,255)
    label: string;

    @IsUUID()
    addressId: string;

    @IsUUID()
    scheduleId: string

    @IsInt()
    @Min(0)
    @IsOptional()
    medianDeliveryTime: number

    @IsInt()
    @Min(0)
    @IsOptional()
    medianPickupTime: number
}
export class UpdateOrganizationDto extends CreateOrganizationDto {}
