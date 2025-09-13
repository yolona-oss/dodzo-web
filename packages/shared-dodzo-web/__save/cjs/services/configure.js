"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureAuthorization = exports.configureServices = void 0;
const appUtils_1 = require("../utils/appUtils");
const backendApi_1 = require("./backendApi");
/**
 * Provisions the services module.
 */
const configureServices = (config) => {
    var _a, _b, _c, _d;
    const baseAppUrl = config.appId && config.appEnv ? (0, appUtils_1.appUrl)(config.appId, config.appEnv) : null;
    const baseApiUrl = config.apiUrl || (config.appId && config.appEnv ? (0, appUtils_1.apiUrl)(config.appId, config.appEnv) : null);
    const versionedApiUrl = baseApiUrl && `${baseApiUrl}/api`;
    (_a = backendApi_1.backendApi.defaults.headers.common)['x-app-url'] ?? (_a['x-app-url'] = baseAppUrl);
    (_b = backendApi_1.backendApi.defaults.headers.common)['x-app-env'] ?? (_b['x-app-env'] = config.appEnv);
    (_c = backendApi_1.backendApi.defaults.headers.common)['x-app-id'] ?? (_c['x-app-id'] = config.appId);
    (_d = backendApi_1.backendApi.defaults.headers.common)['x-app-version'] ?? (_d['x-app-version'] = config.appVersion);
    backendApi_1.backendApi.defaults.headers.common['x-time-zone'] = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // Set the base URL for backend API requests
    if (versionedApiUrl && versionedApiUrl !== backendApi_1.backendApi.defaults.baseURL) {
        backendApi_1.backendApi.defaults.baseURL = versionedApiUrl;
    }
    // Set the cookie for server-side requests
    if (config.cookies && typeof window === 'undefined') {
        backendApi_1.backendApi.interceptors.request.use((backendConfig) => {
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
exports.configureServices = configureServices;
/**
 * Provisions the services with an auth bearer token.
 */
const configureAuthorization = (token) => {
    backendApi_1.backendApi.defaults.headers.common.Authorization = token && `Bearer ${token}`;
};
exports.configureAuthorization = configureAuthorization;
//# sourceMappingURL=configure.js.map