import 'reflect-metadata';
import http from "../../utils/httpClient";
import type {
    ICart,
    AddCartItemDto,
    RemoveCartItemDto,
    UpdateCartItemDto,
} from "@dodzo-web/shared";

export const cartApi = {
    getCart: async (): Promise<ICart> => {
        const res = await http.get(`/cart`, { requireAuthHeader: true, withCredentials: true });
        return res.data
    },

    getCartTotal: async (): Promise<number> => {
        const res = await http.get(`/cart/total`, { requireAuthHeader: true, withCredentials: true });
        return res.data
    },

    addCartItem: async (data: AddCartItemDto): Promise<ICart> => {
        const res = await http.put(`/cart/add`, data, { requireAuthHeader: true, withCredentials: true });
        return res.data
    },

    removeCartItem: async (data: RemoveCartItemDto): Promise<ICart> => {
        const res = await http.put(`/cart/remove`, data, { requireAuthHeader: true, withCredentials: true });
        return res.data
    },

    updateCartItem: async (data: UpdateCartItemDto): Promise<ICart> => {
        const res = await http.put(`/cart/update`, data, { requireAuthHeader: true, withCredentials: true });
        return res.data
    },

    clearCart: async (): Promise<ICart> => {
        const res = await http.delete(`/cart`, { requireAuthHeader: true, withCredentials: true });
        return res.data
    },
}
