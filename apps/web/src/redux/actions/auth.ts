'use client';

import { authApi } from "../../api";
import {
    addAuthToken,
    addAuthUser,
    authUserLogout,
} from "../features/auth/authSlice";
import { newNotify } from "../features/notify/notifySlice";
import { useAppDispatch } from "../store";
import { deleteRefreshToken } from "@/utils/cookies";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from 'next/navigation';

export function useLogin() {
    const dispatch = useAppDispatch();
    const router = useRouter()

    return useMutation({
        mutationFn: authApi.login,
        onSuccess: (response) => {
            dispatch(addAuthToken({ token: response.access_token }));
            dispatch(addAuthUser({ user: response.user }));
            router.push('/')
        },
        onError: (error) => {
            console.log(error.message)
        }
    });
}

export function useSignup() {
    const dispatch = useAppDispatch();
    const router = useRouter()

    return useMutation({
        mutationFn: authApi.signup,
        onSuccess: (response) => {
            dispatch(addAuthToken({ token: response.access_token }));
            router.push('/')
        },
        onError: (error: any) => {
            dispatch(newNotify({
                title: "Cannot create account",
                description: error.response.data.userMessage, variant: "error"
            }));
        }
    });
}

export function useRefreshToken() {
    const dispatch = useAppDispatch();

    return useMutation({
        mutationFn: authApi.refreshToken,
        onSuccess: (response) => {
            dispatch(addAuthToken({ token: response.access_token }));
        },
        onError: () => {
            dispatch(authUserLogout());
        },
    });
}

export function useLogout() {
    const dispatch = useAppDispatch();
    const router = useRouter()

    return useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            dispatch(authUserLogout());
            deleteRefreshToken();
            router.push('/')
        },
    });
}

export function useLogoutEveryDevice() {
    const dispatch = useAppDispatch();
    const router = useRouter()

    return useMutation({
        mutationFn: authApi.logoutEveryDevice,
        onSuccess: () => {
            dispatch(authUserLogout());
            deleteRefreshToken();
            router.push('/')
        },
    });
}

export function useForgotPassword() {
    const dispatch = useAppDispatch();

    return useMutation({
        mutationFn: authApi.forgotpass,
        onSuccess: (response) => {
            dispatch(
                newNotify({
                    title: "Password Reset",
                    variant: "success",
                    description: response.data?.feedback || "Password reset has been initiated. Please check your inbox for further instructions.",
                })
            );
        },
    });
}

export function useResetPassword() {
    const dispatch = useAppDispatch();
    const router = useRouter()

    return useMutation({
        mutationFn: authApi.resetpass,
        onSuccess: () => {
            dispatch(
                newNotify({
                    title: "Password Reset",
                    variant: "success",
                    description: "Password has been reset successfully.",
                })
            );
            router.push('/')
        },
    });
}
