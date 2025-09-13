import { ICustomer } from "./Customer";
import { IWishlistItem } from "./WishlistItem";

export interface IWishlist {
    id: string;
    customer: ICustomer
    items: IWishlistItem
}
