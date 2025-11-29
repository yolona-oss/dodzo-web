import { IsOptional, IsString, IsUUID } from "class-validator"

export class CreateRestaurantDto {
    @IsString()
    name: string

    @IsString()
    @IsOptional()
    slug?: string

    @IsString()
    @IsOptional()
    timezone?: string;

    @IsUUID()
    addressId: string

    @IsUUID()
    scheduleId: string

    @IsString()
    hasLounge: string

    @IsString()
    hasDelivery: string

    @IsOptional()
    @IsString()
    deliverySettings?: string
}
