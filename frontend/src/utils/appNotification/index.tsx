"use client";

import { useEffect } from "react";
import { useSnackbar, VariantType } from "notistack";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import { closeNotify } from "@/redux/features/notify/notifySlice";

export default function NotifyListener() {
    const { open, title, description, variant } = useAppSelector((state) => state.notice);
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (open && (title || description)) {
            enqueueSnackbar(
                <div>
                    {title && <strong>{title}</strong>}
                    {description && <div style={{ fontSize: "0.85rem" }}>{description}</div>}
                </div>,
                { variant: variant as VariantType }
            );
            setTimeout(() => {
                dispatch(closeNotify());
            }, 5000); // TODO configure time
        }
    }, [open, title, description, variant, enqueueSnackbar, dispatch]);

    return null;
}
