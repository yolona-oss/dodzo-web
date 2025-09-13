import { IsOptional, IsUUID } from 'class-validator';
export class CreateCustomerDto {
    @IsUUID()
    userId: string;

    @IsOptional()
    @IsUUID()
    deliveryAddressId?: string;
}
export class UpdateCustomerDto extends CreateCustomerDto {}
