import { ICustomer } from "./Customer";
import { IOrder } from "./Order";
export interface IPayment {
    customer: ICustomer;
    order: IOrder;
    amount: number;
    status: string;
    paymentMethod: string;
    providerPaymentId?: string;
}
//# sourceMappingURL=Payment.d.ts.map