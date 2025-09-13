'use client'
import { useEffect, useRef } from 'react';
import { useRefreshToken } from '@/redux/actions';

export const useAuthBootstrap = () => {
    const didRun = useRef(false);

    useEffect(() => {
        if (didRun.current) return;
        didRun.current = true;

        useRefreshToken()
    }, []);
};
