import 'reflect-metadata'

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAuthUser } from "@dodzo-web/shared";

export interface AuthState {
    user: IAuthUser | null;
    token: string | undefined;
    token_loading: boolean;
}

const initialState: AuthState = {
    user: null,
    token: undefined,
    token_loading: false, // when `token` info is being processed [e.g refreshing auth]
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        addAuthToken(state, action: PayloadAction<{ token: string }>) {
            const { payload } = action;
            return {
                ...state,
                token: payload.token,
            };
        },
        addAuthUser(state, action: PayloadAction<{ user: IAuthUser }>) {
            const { payload } = action;
            return {
                ...state,
                user: { ...state.user, ...payload.user },
                user_loading: false,
            };
        },
        authUserLogout() {
            return {
                ...initialState,
            };
        },
        authTokenLoading(state, action: PayloadAction<{ loading: boolean }>) {
            const { payload } = action;
            return {
                ...state,
                token_loading: Boolean(payload.loading),
            };
        },
    },
});

export const {
    addAuthToken,
    addAuthUser,
    authTokenLoading,
    authUserLogout,
} = authSlice.actions;

export default authSlice.reducer;
