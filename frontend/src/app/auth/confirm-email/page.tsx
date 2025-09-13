'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import * as API from '@/api';
import { Container } from '@/components/ui/container';

export default function ConfirmEmailPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('No token provided');
            return;
        }

        API.confirmEmail({ token })
            .then((res) => {
                setStatus('success');
                setMessage(res.message || 'Email confirmed successfully');
            })
            .catch((err) => {
                setStatus('error');
                setMessage(err.response?.data?.message || 'Email confirmation failed');
            });
    }, [token]);

    return (
        <Container>
            {status === 'loading' && <p>Confirming your email...</p>}
            {status === 'success' && (
                <div className="text-green-600 text-center">
                    <h1 className="text-2xl font-bold mb-2">Your Account has been confirmed</h1>
                    <p>{message}</p>
                </div>
            )}
            {status === 'error' && (
                <div className="text-red-600 text-center">
                    <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
                    <p>{message}</p>
                </div>
            )}
        </Container>
    );
}
