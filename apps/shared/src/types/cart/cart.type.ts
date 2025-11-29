import { IRestaurant } from "../restaurant";
import { IUser } from "../user.type";
import { ICartItem } from "./cart-item.type";

export interface ICart {
    id: string
    user: IUser;
    restaurant: IRestaurant;
    isActive: boolean; // Active cart or converted to order
    sessionId?: string; // For guest carts
    items: ICartItem[]
    expiresAt?: Date;

    createdAt: Date
    updatedAt: Date
}
