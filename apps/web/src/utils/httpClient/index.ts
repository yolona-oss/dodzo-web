import axios, { AxiosRequestConfig } from "axios";

const BASEURL = process.env.NEXT_PUBLIC_API_URL + "/api/v1";
const TIMEOUTMSG = "Waiting for too long...Aborted !";

declare module 'axios' {
    interface AxiosRequestConfig {
        requireAuthHeader?: boolean;
    }
}

const config: AxiosRequestConfig = {
    baseURL: BASEURL,
    timeout: 20000,
    timeoutErrorMessage: TIMEOUTMSG,
    headers: {
        "Content-Type": "application/json",
        'restaurant_id': '1'
    }
};

const http = axios.create(config);

export default http;
