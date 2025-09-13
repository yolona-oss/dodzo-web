import { IImage } from "./Image"

export interface ICategory {
    id: string
    title: string
    description: string
    image: IImage
}

export interface ISubCategory {
    id: string
    name: string
    category: ICategory
}
