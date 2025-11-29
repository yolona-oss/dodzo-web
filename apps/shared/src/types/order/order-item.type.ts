import { IProduct } from "../product";
import { IOrder } from "./order.type";

export interface IOrderItem {
    id: string
    order: IOrder;
    product: IProduct;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    customizations?: Record<string, any>;

    createdAt: Date
}
