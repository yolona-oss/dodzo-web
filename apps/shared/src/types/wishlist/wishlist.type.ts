import { IRestaurant } from "../restaurant";
import { IUser } from "../user.type";
import { IWishlistItem } from "./wishlist-item.type";

export interface IWishlist {
    id: string
    user: IUser;
    restaurant: IRestaurant;
    name: string
    isDefault: boolean
    items: IWishlistItem

    createdAt: Date
    updatedAt: Date
}
