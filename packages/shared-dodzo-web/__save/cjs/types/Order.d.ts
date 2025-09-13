import { IAuthUser } from "auth/types/AuthUser";
import { IOrg } from "./Organization";
import { IPayment } from "./Payment";
import { IProductItem } from "./ProductItem";
export interface IOrder {
    user: IAuthUser;
    products: IProductItem;
    comment: string;
    status: string;
    producer: IOrg;
    pickupTime?: Date;
    selfPickup: boolean;
    payment: IPayment;
    creationData: Date;
    closingData?: Date;
}
//# sourceMappingURL=Order.d.ts.map