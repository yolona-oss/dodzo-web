import 'reflect-metadata'

import * as API from "@/api";
import { addAuthUser } from "../features/auth/authSlice";
import { useAppDispatch } from "../store";

// export function getUserProfile() {
//     return async function (dispatch: AppDispatch) {
//         try {
//             dispatch(authUserLoading({ loading: true }));
//             const response = await API.getUserProfile();
//
//             const user = response;
//
//             // Add authenticated user to redux store
//             dispatch(addAuthUser({ user }));
//         } catch (error) {
//             console.log(error);
//         } finally {
//             dispatch(authUserLoading({ loading: false }));
//         }
//     };
// }

import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { IAuthUser } from "@dodzo-web/shared";
import { useEffect } from "react";

// export function useUser() {
//     const queryClient = useQueryClient();
//     const dispatch = useAppDispatch();
//
//     const {
//         data: user,
//         isLoading,
//         error,
//     } = useQuery({
//         queryKey: ['user'],
//         queryFn: API.getUserProfile,
//         retry: (failureCount: number, error: any) => {
//             if (error?.response?.status === 401) {
//                 return failureCount < 1;
//             }
//             if (error?.response?.status === 403) {
//                 return false;
//             }
//             return failureCount < 3;
//         },
//         onSuccess: (user: IAuthUser) => {
//             dispatch(addAuthUser({ user }));
//         },
//         staleTime: 1000 * 60 * 5,
//         refetchOnMount: false,
//         refetchOnWindowFocus: false,
//         refetchOnReconnect: false,
//         placeholderData: () => queryClient.getQueryData(['user']),
//     });
//
//     console.log({ user, isLoading, error });
//
//     return {
//         user,
//         isLoading,
//         isAuthenticated: !!user,
//         error,
//     };
// }

export function useUser() {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    const {
        data: user,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['user'],
        queryFn: API.getUserProfile,
        retry: (failureCount: number, error: any) => {
            // Allow one retry for 401 errors to give refresh interceptor a chance
            if (error?.response?.status === 401) {
                return failureCount < 1;
            }
            // Don't retry on other auth errors
            if (error?.response?.status === 403) {
                return false;
            }
            // Retry other errors up to 3 times
            return failureCount < 3;
        },
        staleTime: 1000 * 60 * 5,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        placeholderData: () => queryClient.getQueryData(['user']),
    });

    useEffect(() => {
        if (user) {
            dispatch(addAuthUser({ user }));
        }
    }, [user, dispatch]);

    return {
        user,
        isLoading,
        isAuthenticated: !!user,
        error,
    }
}
