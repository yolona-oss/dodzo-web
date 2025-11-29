import { IOrderItem } from "./order-item.type";
import { IRestaurant } from "../restaurant";
import { IUser } from "../user.type";
import { OrderStatus } from "./order-status.type";
import { OrderType } from "./order-type.type";
import { IAddressBook } from "../address-book.type";

export interface IOrder {
    id: string
    orderNumber: string;
    user: IUser;
    restaurant: IRestaurant;
    status: OrderStatus
    orderType: OrderType
    pickupTime?: Date // For all types of order
    subtotal: number;
    tax: number
    deliveryFee: number
    total: number;
    deliveryAddress?: IAddressBook
    metadata?: Record<string, any>;
    items: IOrderItem[]

    estimatedDeliveryTime?: Date;
    actualDeliveryTime?: Date;

    createdAt: Date
    updatedAt: Date
}
