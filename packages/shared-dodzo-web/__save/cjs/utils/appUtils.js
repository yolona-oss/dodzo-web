"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appUrl = exports.apiUrl = exports.appName = void 0;
/**
 * Returns the app name for the given app.
 */
const appName = (appId) => {
    switch (appId) {
        case '@dodzo-web/backend':
            return 'Demo API';
        default:
            return 'Demo';
    }
};
exports.appName = appName;
/**
 * Returns the API url for the given app and environment.
 */
const apiUrl = (appId, environment) => {
    if (environment === 'development') {
        return 'http://localhost:4000';
    }
    switch (appId) {
        case '@dodzo-web/frontend':
            return 'http://localhost:4000';
        default:
            return 'http://localhost:4000';
    }
};
exports.apiUrl = apiUrl;
/**
 * Returns the app url for the given app and environment.
 */
const appUrl = (appId, environment) => {
    switch (appId) {
        case '@dodzo-web/frontend':
            switch (environment) {
                case 'development':
                    return 'http://localhost:3000';
                default:
                    return 'http://localhost:3000';
            }
        default:
            switch (environment) {
                case 'development':
                    return 'http://localhost:3000';
                default:
                    return 'http://localhost:3000';
            }
    }
};
exports.appUrl = appUrl;
//# sourceMappingURL=appUtils.js.map