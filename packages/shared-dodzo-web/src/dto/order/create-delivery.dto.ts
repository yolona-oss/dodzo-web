import { IsUUID } from 'class-validator';
export class CreateDeliveryDto {
    @IsUUID()
    orderId: string;

    @IsUUID()
    destinationAddressId: string;

    @IsUUID()
    driverId: string;
}
