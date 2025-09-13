// import { IOrder } from "./Order";
import { IOrg } from "./Organization";
import { IProduct } from "./Product";

export interface IOrderItem {
    id: string;
    product: IProduct;
    organization: IOrg
    quantity: number;
    priceAtOrder: number
}
