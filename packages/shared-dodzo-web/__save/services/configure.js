import { apiUrl, appUrl } from '../utils/appUtils';
import { backendApi } from './backendApi';
/**
 * Provisions the services module.
 */
export const configureServices = (config) => {
    var _a, _b, _c, _d;
    const baseAppUrl = config.appId && config.appEnv ? appUrl(config.appId, config.appEnv) : null;
    const baseApiUrl = config.apiUrl || (config.appId && config.appEnv ? apiUrl(config.appId, config.appEnv) : null);
    const versionedApiUrl = baseApiUrl && `${baseApiUrl}/api`;
    (_a = backendApi.defaults.headers.common)['x-app-url'] ?? (_a['x-app-url'] = baseAppUrl);
    (_b = backendApi.defaults.headers.common)['x-app-env'] ?? (_b['x-app-env'] = config.appEnv);
    (_c = backendApi.defaults.headers.common)['x-app-id'] ?? (_c['x-app-id'] = config.appId);
    (_d = backendApi.defaults.headers.common)['x-app-version'] ?? (_d['x-app-version'] = config.appVersion);
    backendApi.defaults.headers.common['x-time-zone'] = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // Set the base URL for backend API requests
    if (versionedApiUrl && versionedApiUrl !== backendApi.defaults.baseURL) {
        backendApi.defaults.baseURL = versionedApiUrl;
    }
    // Set the cookie for server-side requests
    if (config.cookies && typeof window === 'undefined') {
        backendApi.interceptors.request.use((backendConfig) => {
            const newConfig = backendConfig;
            newConfig.headers.set('Cookie', config.cookies);
            return newConfig;
        }, (error) => Promise.reject(error));
    }
    // Remove sensitive information from config to avoid leaking it to the client
    const { cookies: _cookies, ...safeConfig } = config;
    // Return safe config to initialize client-side if needed
    return safeConfig;
};
/**
 * Provisions the services with an auth bearer token.
 */
export const configureAuthorization = (token) => {
    backendApi.defaults.headers.common.Authorization = token && `Bearer ${token}`;
};
//# sourceMappingURL=configure.js.map