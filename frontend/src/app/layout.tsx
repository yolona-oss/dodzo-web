'use client'

if (typeof window === 'undefined') {
    require('reflect-metadata');
}

import './globals.css';
import { satoshi } from './fonts';

import { Provider } from 'react-redux';

import { ThemeProvider } from '@/components/providers/themeProvider';

import { SnackbarProvider } from "notistack";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

/////
import store from '@/redux/store';

////
import httpInterceptors from "@/utils/httpClient/interceptors";
httpInterceptors.attach(store);

const queryClient = new QueryClient();

import AppNotification from "../utils/appNotification";
import { Header } from '@/components/header';
import { AuthProvider } from "@/components/providers/authProvider";
import { CartProvider } from '@/components/cart/cart-context';

function RootLayout({
    children,
}: Readonly<{
        children: React.ReactNode;
    }>) {
    return (
        <html lang="ru">
            <body
                className={`${satoshi.variable} antialiased min-h-screen flex flex-col`}
            >
                <Provider store={store}>
                    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
                        <QueryClientProvider client={queryClient}>
                            <ReactQueryDevtools initialIsOpen={false} />
                            <AuthProvider>
                                <ThemeProvider
                                    attribute="class"
                                    defaultTheme="system"
                                    enableSystem
                                    disableTransitionOnChange
                                >
                                    <CartProvider>
                                        <Header />
                                        {children}
                                        <AppNotification />
                                    </CartProvider>
                                </ThemeProvider>
                            </AuthProvider>
                        </QueryClientProvider>
                    </SnackbarProvider>
                </Provider>
            </body>
        </html>
    );
}

export default RootLayout;
