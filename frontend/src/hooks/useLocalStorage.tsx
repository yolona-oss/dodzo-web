'use client'
import { useState, useEffect } from "react";

export interface IStorage {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
}

type StorageSelector<T> = (storage: Storage) => T;

function useLocalStorage<T = IStorage>(selector: StorageSelector<T>): T {
    if (!selector) throw Error("Local storage selector is required");
    if (typeof selector !== "function")
        throw Error("Local storage selector should be a function");

    const [, triggerRender] = useState(0);

    useEffect(() => {
        const controller = new AbortController();

        function handleStorageChange(event: any) {
            event.stopPropagation();

            console.log("Browser storage changed!");

            triggerRender((prev) => prev + 1);
        }

        window.addEventListener("storageChange", handleStorageChange, {
            signal: controller.signal,
            capture: false,
        });

        return () => {
            controller.abort();
        };
    }, []);

    return selector(window.localStorage);
}

export default useLocalStorage;
