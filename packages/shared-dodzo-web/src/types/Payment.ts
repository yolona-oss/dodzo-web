import { ICustomer } from "./Customer"
import { IOrder } from "./Order"

export interface IPayment {
    id: string
    customer: ICustomer
    order: IOrder
    amount: number
    status: string
    paymentMethod: string
    providerPaymentId?: string;
}
