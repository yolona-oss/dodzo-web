import { IOrg } from "./Organization";
import { IProduct } from "./Product";
// import { IWishlist } from "./Wishlist";

export interface IWishlistItem {
    id: string;
    product: IProduct
    organization: IOrg
    quantity: number
}
