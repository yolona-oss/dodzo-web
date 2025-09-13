import { ICategory, ISubCategory } from "./Category";
import { IImage } from "./Image";
export interface IProduct {
    id: string;
    title: string;
    description: string;
    sku: string;
    primaryImage: IImage;
    images: IImage[];
    price: number;
    category: ICategory;
    subCategory: ISubCategory;
}
//# sourceMappingURL=Product.d.ts.map