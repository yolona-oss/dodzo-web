import { IProduct } from "./product"
import { IUser } from "./user.type"

export interface IProductReview {
    id: string
    product: IProduct
    user: IUser
    text: string
    rating: number
}
