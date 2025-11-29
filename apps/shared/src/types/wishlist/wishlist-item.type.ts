import { IProduct } from "../product/index";
import { IWishlist } from "./wishlist.type";

export interface IWishlistItem {
    id: string
    wishlist: IWishlist;
    product: IProduct;
    notes?: string;
    notifyOnAvailable?: boolean;

    createdAt: Date
    updatedAt: Date
}
