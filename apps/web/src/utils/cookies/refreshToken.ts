import 'reflect-metadata'
// import { REFRESH_TOKEN } from "@dodzo-web/shared";
import Cookies from "js-cookie";

export function getRefreshToken() {
    return Cookies.get('refreshTkn');
}

export function deleteRefreshToken() {
    Cookies.remove('refreshTkn');
}
