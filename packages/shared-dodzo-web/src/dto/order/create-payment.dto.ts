import { IsInt, IsOptional, IsString, IsUUID, Min, Length } from 'class-validator';
export class CreatePaymentDto {
    @IsUUID()
    orderId: string;

    @IsInt()
    @Min(0)
    amount: number;

    @IsString()
    @Length(1,255)
    status: string;

    @IsString()
    @Length(1,255)
    paymentMethod: string; // 'card' | 'cash' | 'yookassa' | 'stripe'

    @IsOptional()
    @IsString()
    @Length(1,255)
    providerPaymentId?: string;
}
