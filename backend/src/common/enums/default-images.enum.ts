import { Values } from "../types/values.type"

export const DefaultImages = {
    User: "User",
    Product: "Product",
    Category: "Category"
}

type TDefaultImages = typeof DefaultImages
export type DefaultImagesType = keyof TDefaultImages
//export type DefaultImagesType = {
//    [P in keyof TDefaultImages]: {
//        key: P,
//        value: Values<TDefaultImages[P][number]>
//    }
//}
