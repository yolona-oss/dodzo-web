import 'reflect-metadata';

import { IAuthUser } from "@dodzo-web/shared";
import http from "../../utils/httpClient";

export async function getUserProfile(): Promise<IAuthUser> {
    const res = await http.get(`/users/profile`, { requireAuthHeader: true, withCredentials: true });
    return res.data
}

export async function updateProfile(data: any): Promise<IAuthUser> {
    const res = await http.put(`/users`, data)
    return res.data
}
