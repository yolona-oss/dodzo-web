import 'reflect-metadata';

import type { IUser, UpdateUserDto } from "@dodzo-web/shared";
import http from "../../utils/httpClient";

export const userApi = {
    getUserProfile: async (): Promise<IUser> => {
    const res = await http.get(`/users/profile`, { requireAuthHeader: true, withCredentials: true });
    return res.data
    },

    updateProfile: async (data: UpdateUserDto): Promise<IUser> => {
        const res = await http.put(`/users`, data, { withCredentials: true })
        return res.data
    }
}
