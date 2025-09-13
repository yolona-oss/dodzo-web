import { ICustomer } from "./Customer";
import { IProduct } from "./Product";
export interface IProductReview {
    id: string;
    product: IProduct;
    customer: ICustomer;
    body: string;
    rating: number;
}
//# sourceMappingURL=Review.d.ts.map