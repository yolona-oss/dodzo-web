import { IAuthUser } from "auth/types/AuthUser";
import { IAddressBook } from "./AddressBook";
import { IOrder } from "./Order";
import { ICart } from "./Cart";
export interface ICustomer {
    user: IAuthUser;
    cart: ICart;
    orders: IOrder;
    deliveryAddress: IAddressBook[];
}
//# sourceMappingURL=Customer.d.ts.map