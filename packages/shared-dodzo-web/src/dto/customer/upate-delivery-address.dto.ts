import { IsUUID } from 'class-validator';
export class UpdateCustomerDeliveryAddressDto {
    @IsUUID()
    addressId: string;
}
