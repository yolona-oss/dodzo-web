'use client'
import { storageChangeEvent } from "./customEvent";

let storage: Storage
if (typeof window !== "undefined") {
    storage = sessionStorage;
}

const AuthTknName = "u:Id";
const IsAuthenticatedName = "isAuthenticated";

const authStorage = {
    get authTkn(): string | undefined {
        try {
            let token = storage.getItem(AuthTknName);
            if (!token) return undefined;
            token = JSON.parse(token);
            return token ?? undefined;
        } catch (error) {
            return undefined;
        }
    },

    set authTkn(token: string) {
        // if (token) storage.setItem(AuthTknName, JSON.stringify(token));
        storage.setItem(IsAuthenticatedName, JSON.stringify(Boolean(token)));
        window.dispatchEvent(storageChangeEvent);
    },

    get isAuthenticated(): boolean {
        try {
            const isAuthenticated = JSON.parse(storage.getItem(IsAuthenticatedName)!);
            return Boolean(isAuthenticated);
        } catch (error) {
            return false;
        }
    },

    logout() {
        storage.removeItem(AuthTknName);
        storage.removeItem(IsAuthenticatedName);

        window.dispatchEvent(storageChangeEvent);
    },
};

export { authStorage };
