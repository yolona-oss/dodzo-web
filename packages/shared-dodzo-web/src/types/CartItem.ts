// import { ICart } from "./Cart";
import { IOrg } from "./Organization";
import { IProduct } from "./Product";

export interface ICartItem {
    id: string
    product: IProduct
    organization: IOrg
    quantity: number
}
