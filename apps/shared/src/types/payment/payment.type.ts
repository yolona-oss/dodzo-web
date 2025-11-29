import { IOrder } from "../order/index"
import { PaymentMethod } from "./payment-method.type"
import { PaymentStatus } from "./payment-status.type"

export interface IPayment {
    id: string
    order: IOrder
    currency: string
    amount: number
    status: PaymentStatus
    paymentMethod: PaymentMethod
    providerPaymentId?: string;
}
