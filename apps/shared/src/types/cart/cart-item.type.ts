import { IProduct } from "../product/index";
import { ICart } from "./cart.type";

export interface ICartItem {
    id: string
    cart: ICart;
    product: IProduct;
    quantity: number
    isForDelivery: boolean
    customizations?: Record<string, any>; // Special requests, extras, etc.
    priceAtAdd: number; // Price when added to cart

    createdAt: Date
    updatedAt: Date
}
