import { IAuthUser } from "@/auth/types/AuthUser";
import { IOrg } from "./Organization";
import { IOrderItem } from "./OrderItem";

export interface IOrder {
    id: string
    user: IAuthUser;
    items: IOrderItem;
    comment: string;
    status: string;
    producer: IOrg;
    pickupTime?: Date
    selfPickup: boolean
    creationData: Date;
    closedAt?: Date;
}
