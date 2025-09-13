import 'reflect-metadata';
import {
    ConfirmMailDto,
    CreateUserDto,
    IAccessToken,
    IAuthSession,
    LoginCredentials
} from "@dodzo-web/shared";
import http from "../../utils/httpClient";

export async function login(data: LoginCredentials): Promise<IAuthSession> {
    const res = await http.post<IAuthSession>("/auth/login", data, { withCredentials: true });
    return res.data
}

export async function signup(data: CreateUserDto): Promise<IAuthSession> {
    const res = await http.post<IAuthSession>("/auth/signup", data, { withCredentials: true });
    return res.data
}

export async function confirmEmail(dto: ConfirmMailDto): Promise<{message: string}> {
    const res = await http.post(`/auth/confirm-email`, dto);
    return res.data
}

export async function refreshToken(): Promise<IAccessToken> {
    const res = await http.post<IAccessToken>("/auth/refresh", undefined, {
        withCredentials: true,
    });
    return res.data
}

export const logout = async () =>
    await http.post("/auth/logout", undefined, {
        withCredentials: true,
        requireAuthHeader: true,
    });

export const logoutEveryDevice = async () =>
    await http.post("/auth/master-logout", undefined, {
        withCredentials: true,
        // requireAuthHeader: true,
    });

export const forgotpass = async (data: { email: string }) =>
    await http.post("/auth/forgotpass", data, {
        headers: {
            "X-reset-base": `${document.location.origin}/change-pass`,
        },
    });

export async function resetpass(data: { resetToken: string; password: string; passwordConfirm: string }) {
    const { resetToken, password, passwordConfirm } = data;

    const res = await http.post(`/auth/resetpass/${resetToken}`, { password, passwordConfirm });
    return res.data
};
