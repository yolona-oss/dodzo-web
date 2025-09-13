'use client';

import * as API from "../../api";
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
        mutationFn: API.login,
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
        mutationFn: API.signup,
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
        mutationFn: API.refreshToken,
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
        mutationFn: API.logout,
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
        mutationFn: API.logoutEveryDevice,
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
        mutationFn: API.forgotpass,
        onSuccess: (response) => {
            dispatch(
                newNotify({
                    msg: response.data?.feedback || "Password reset has been initiated. Please check your inbox for further instructions.",
                })
            );
        },
    });
}

export function useResetPassword() {
    const dispatch = useAppDispatch();
    const router = useRouter()

    return useMutation({
        mutationFn: API.resetpass,
        onSuccess: () => {
            dispatch(
                newNotify({
                    msg: "Your Password has been changed successfuly. Now login with your new password.",
                    variant: "success",
                })
            );
            router.push('/')
        },
    });
}
