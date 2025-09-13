import { ICartItem } from "./CartItem";
import { ICustomer } from "./Customer";

export interface ICart {
    id: string
    customer: ICustomer
    items: ICartItem[]
}
