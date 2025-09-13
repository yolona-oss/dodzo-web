'use client'

import 'reflect-metadata';
import { useEffect} from 'react';
import { authUserLogout } from '@/redux/features/auth/authSlice';
import { useLogout, useRefreshToken } from '@/redux/actions';
import { useAppDispatch } from '@/redux/store';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import { REFRESH_TOKEN } from '@dodzo-web/shared';

const updateIntervalTime = 5 * 60 * 1000;

export const useTokenRefreshCheck = () => {
    const dispatch = useAppDispatch();
    const refreshTkn = Cookies.get(REFRESH_TOKEN.cookie.name)

    if (!refreshTkn) {
        dispatch(authUserLogout())
        return
    }

    const decoded = jwtDecode<any>(refreshTkn)
    const refreshExpiresAt = decoded!.exp! * 1000

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (!refreshExpiresAt) return
            const timeLeft = refreshExpiresAt - Date.now();
            if (timeLeft <= 0) {
                useLogout()
            } else if (timeLeft < 5 * 60 * 1000) {
                useRefreshToken()
            }
        }, updateIntervalTime);

        return () => clearInterval(intervalId);
    }, [dispatch, refreshExpiresAt]);
};
