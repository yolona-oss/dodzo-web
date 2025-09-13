import 'reflect-metadata';
import { IProduct, IProductReview } from "@dodzo-web/shared";
import http from "../../utils/httpClient";
import { recordToQuery } from "@/utils/misc";

export async function getAllProducts(): Promise<IProduct> {
    const res = await http.get(`/products`);
    return res.data
}

export async function getProductsCount(): Promise<number> {
    const res = await http.get(`/products/count`);
    return res.data
}

export async function createProduct(data: any): Promise<IProduct> {
    throw new Error("Function not implemented.");
    const res = await http.post(`/products`, data);
    return res.data
}

export async function getProductById(id: string): Promise<IProduct> {
    const res = await http.get(`/products/${id}`);
    return res.data
}

export async function getProductReviews(id: number): Promise<IProductReview[]> {
    const res = await http.get(`/products/${id}/reviews`);
    return res.data
}

export async function addProductReview(data: any): Promise<IProductReview> {
    throw new Error("Function not implemented.");
    const res = await http.post(`/products/${data.productId}/reviews`, data)
    return res.data
}

export async function updateProduct(id: number, data: any): Promise<IProduct> {
    const res = await http.put(`/products/${id}`, data, { requireAuthHeader: true, withCredentials: true });
    return res.data
}

export async function deleteProduct(id: number): Promise<IProduct> {
    const res = await http.delete(`/products/${id}`, { requireAuthHeader: true, withCredentials: true });
    return res.data
}
