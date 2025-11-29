import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VariantType } from "notistack";

function numberToStringType(statusCode: number) {
    if (statusCode >= 400 && statusCode <= 599) {
        return "error";
    } else if (statusCode >= 200 && statusCode <= 299) {
        return "success";
    } else {
        return "default";
    }
}

export interface NotifyState {
    open: boolean;
    title: string;
    description: string;
    variant: VariantType | number;
}

const initialState: NotifyState = {
    open: false,
    title: "",
    description: "",
    variant: "default",
};

const notifySlice = createSlice({
    name: "notify",
    initialState,
    reducers: {
        newNotify(
            state,
            action: PayloadAction<{
                open?: boolean;
                title: string;
                description: string;
                variant?: number | VariantType;
            }>
        ) {
            const { payload } = action;
            const haveContent = Boolean(payload.title || payload.description);

            state.open = "open" in payload ? payload.open! : haveContent;
            state.title = payload.title
            state.description = payload.description
            state.variant = Number.isInteger(payload.variant)
                ? numberToStringType(payload.variant as number)
                : (payload.variant as VariantType) || "default";
        },
        closeNotify(state) {
            state.open = false;
            state.title = "";
            state.description = "";
        },
    },
});

export const { newNotify, closeNotify } = notifySlice.actions;

export default notifySlice.reducer;
