import 'reflect-metadata';
import http from "../../utils/httpClient";
import {
    AddToCartDto,
    ICart,
    RemoveFromCartDto,
    UpdateCartDto
} from "@dodzo-web/shared";

export async function getCart(): Promise<ICart> {
    const res = await http.get(`/cart`, { requireAuthHeader: true, withCredentials: true });
    return res.data
}

export async function getCartTotal(): Promise<number> {
    const res = await http.get(`/cart/total`, { requireAuthHeader: true, withCredentials: true });
    return res.data
}

export async function addCartItem(data: AddToCartDto): Promise<ICart> {
    const res = await http.put(`/cart/add`, data, { requireAuthHeader: true, withCredentials: true });
    return res.data
}

export async function removeCartItem(data: RemoveFromCartDto): Promise<ICart> {
    const res = await http.put(`/cart/remove`, data, { requireAuthHeader: true, withCredentials: true });
    return res.data
}

export async function updateCartItemQuantity(data: UpdateCartDto): Promise<ICart> {
    const res = await http.put(`/cart/set-quantity`, data, { requireAuthHeader: true, withCredentials: true });
    return res.data
}

export async function clearCart(): Promise<ICart> {
    const res = await http.delete(`/cart`, { requireAuthHeader: true, withCredentials: true });
    return res.data
}
