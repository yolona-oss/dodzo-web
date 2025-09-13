import { Constants } from '../../constants';
export const getSessionCookieName = (isHttps, type = 'access') => {
    const prefix = isHttps ? '__Secure-' : '';
    return `${prefix}${Constants.AUTH_COOKIE_NAME}${type === 'refresh' ? '-refresh' : ''}`;
};
//# sourceMappingURL=getSessionCookieName.js.map