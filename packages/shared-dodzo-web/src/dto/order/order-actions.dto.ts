import { IsEnum, IsInt, IsUUID, Min } from 'class-validator';
import { OrderStatus } from '../../enums'

export class AddToOrderDto {
    @IsUUID()
    productId: string;

    @IsInt()
    @Min(1)
    quantity: number;
}

export class UpdateOrderStatusDto {
    @IsEnum(OrderStatus)
    status: OrderStatus;
}
