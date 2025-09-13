import { IAuthUser } from "@/auth/types/AuthUser"
import { IAddressBook } from "./AddressBook"
import { IOrder } from "./Order"
import { ICart } from "./Cart"
import { IWishlist } from "./Wishlist"
import { IProductReview } from "./Review"

export interface ICustomer {
    user: IAuthUser
    cart: ICart
    orders: IOrder
    wishlist: IWishlist
    deliveryAddress: IAddressBook[]
    reviews: IProductReview[]
}
