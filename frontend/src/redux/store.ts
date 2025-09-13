'use client'
import { configureStore } from "@reduxjs/toolkit";

import notifyReducer from "./features/notify/notifySlice";
import authReducer from "./features/auth/authSlice";
import authMiddleware from "./middlewares/authMiddleware";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const store = configureStore({
    reducer: {
        auth: authReducer,
        notice: notifyReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authMiddleware),
    devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
