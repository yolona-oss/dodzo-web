import 'reflect-metadata';
import type { CreateProductDto, IProduct, IProductReview, UpdateProductDto } from "@dodzo-web/shared";
import http from "../../utils/httpClient";
import { recordToQuery } from "@/utils/misc";

export const productApi = {
  getProducts: async (params?: {
    category?: string;
    isActive?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }) => {
    const response = await http.get(`/products`, { params });
    return response.data;
  },

  getProduct: async (id: string) => {
    const response = await http.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (data: CreateProductDto) => {
    const response = await http.post(`/products`, data);
    return response.data;
  },

  updateProduct: async (id: string, data: UpdateProductDto) => {
    const response = await http.put(`/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: string) => {
    const response = await http.delete(`/products/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await http.get(`/products/categories`);
    return response.data;
  },
};
