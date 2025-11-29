import { IRestaurant } from "./restaurant"
import { IProduct } from "./product"

export interface ICategory {
    id: string
    name: string
    description?: string
    parentCategoryId?: string
    restaurant: IRestaurant
    products: IProduct[]
}
