'use client';

import { userApi } from '@/api';
import { useQuery } from '@tanstack/react-query';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    useQuery({
        queryKey: ['user'],
        queryFn: userApi.getUserProfile,
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
        enabled: true,
    });

    return <>{children}</>;
}
