import 'reflect-metadata';
import type {
    ConfirmMailDto,
    CreateUserDto,
    IAccessToken,
    IAuthSession,
    LoginCredentials
} from "@dodzo-web/shared";
import http from "../../utils/httpClient";

export const authApi = {
    login: async (data: LoginCredentials): Promise<IAuthSession> => {
        const res = await http.post<IAuthSession>("/auth/login", data, { withCredentials: true });
        return res.data
    },

    signup: async (data: CreateUserDto): Promise<IAuthSession> => {
        const res = await http.post<IAuthSession>("/auth/signup", data, { withCredentials: true });
        return res.data
    },

    confirmEmail: async (dto: ConfirmMailDto): Promise<{message: string}> => {
        const res = await http.post(`/auth/confirm-email`, dto);
        return res.data
    },

    refreshToken: async (): Promise<IAccessToken> => {
        const res = await http.post<IAccessToken>("/auth/refresh", undefined, {
            withCredentials: true,
        });
        return res.data
    },

    logout: async () =>
        await http.post("/auth/logout", undefined, {
            withCredentials: true,
            requireAuthHeader: true,
        }),

    logoutEveryDevice: async () =>
        await http.post("/auth/master-logout", undefined, {
            withCredentials: true,
            // requireAuthHeader: true,
        }),

    forgotpass: async (data: { email: string }) =>
        await http.post("/auth/forgotpass", data, {
            headers: {
                "X-reset-base": `${document.location.origin}/change-pass`,
            },
        }),

    resetpass: async (data: { resetToken: string; password: string; passwordConfirm: string }) => {
        const { resetToken, password, passwordConfirm } = data;

        const res = await http.post(`/auth/resetpass/${resetToken}`, { password, passwordConfirm });
        return res.data
    },
}

