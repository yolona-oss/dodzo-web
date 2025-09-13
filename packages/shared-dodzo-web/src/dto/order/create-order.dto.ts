import {
    IsArray,
    IsDateString,
    IsEnum,
    IsOptional,
    IsString,
    IsUUID,
    Length
} from 'class-validator';
import { OrderStatus } from '../../enums'
import { IOrderItem } from '../../types';

export class CreateOrderDto {
    @IsUUID()
    organizationId: string;

    @IsArray()
    items: IOrderItem[];

    @IsOptional()
    @IsString()
    @Length(0,255)
    comment?: string;

    @IsOptional()
    @IsEnum(OrderStatus)
    status?: OrderStatus;

    @IsOptional()
    @IsDateString()
    pickupTime?: string; // ISO
}
