import { IAddressBook } from "../address-book.type";
import { ICart } from "../cart";
import { IProduct } from "../product";
import { IWeekSchedule } from "../week-schedule.type";
import { IWishlist } from "../wishlist";
import { RestaurantStatus } from "./restaurant-status.type";

export class IRestaurant {
    id: string

    name: string;
    slug: string
    description?: string;
    phone?: string;
    email?: string;
    schedule: IWeekSchedule;
    address: IAddressBook;
    status: RestaurantStatus;
    hasLounge: boolean
    hasDelivery: boolean
    metadata?: Record<string, any>;
    stock: any // = new Collection<RestaurantStock>(this);
    products: IProduct[]
    carts: ICart[]
    wishlists: IWishlist[]
    outgoingTransfers: any // = new Collection<StockTransfer>(this);
    incomingTransfers: any // = new Collection<StockTransfer>(this);

    createdAt: Date
    updatedAt: Date
}
