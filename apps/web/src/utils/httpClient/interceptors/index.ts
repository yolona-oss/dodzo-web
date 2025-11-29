import http from "..";
import logError from "../errorHandler";
import { addAuthToken } from "@/redux/features/auth/authSlice";
import { authApi } from "@/api";

function runInterceptors(store: any) {
    http.interceptors.request.use(
        (config) => {
            if (config.requireAuthHeader) {
                const token = store.getState().auth.token;

                if (token) {
                    config.headers.set("Authorization", `Bearer ${token}`)
                }

                config.headers.set('restaurant_id', '1')

                delete config.requireAuthHeader;
            }

            return config;
        },
        (error) => {
            logError(error, store);
            return Promise.reject(error);
        }
    );

    function attachResponseInterceptor() {
        const responseInterceptor = http.interceptors.response.use(
            (response) => response,
            async (error) => {
                const config = error?.config;
                const responseError = error?.response;

                if (responseError.status === 401) {
                    http.interceptors.response.eject(responseInterceptor);

                    try {
                        config._retries = config._retries || 0;
                        if (config._retries >= 2)
                            throw new Error(`Max retries reached`);

                        const { access_token } = await authApi.refreshToken();

                        config.headers = {
                            ...config.headers,
                            Authorization: `Bearer ${access_token}`,
                        };

                        store.dispatch(addAuthToken({ token: access_token }));

                        config._retries++;
                        attachResponseInterceptor();

                        return http(config);
                    } catch (reauthError) {
                        attachResponseInterceptor();
                        // console.log("Re Auth Error: ", reauthError);
                    }
                }

                logError(error, store);
                return Promise.reject(error);
            }
        );
    }
    attachResponseInterceptor();
}

const interceptors = { attach: runInterceptors };

export default interceptors;
