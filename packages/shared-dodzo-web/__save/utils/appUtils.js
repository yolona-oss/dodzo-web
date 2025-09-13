/**
 * Returns the app name for the given app.
 */
export const appName = (appId) => {
    switch (appId) {
        case '@dodzo-web/backend':
            return 'Demo API';
        default:
            return 'Demo';
    }
};
/**
 * Returns the API url for the given app and environment.
 */
export const apiUrl = (appId, environment) => {
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
/**
 * Returns the app url for the given app and environment.
 */
export const appUrl = (appId, environment) => {
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
//# sourceMappingURL=appUtils.js.map