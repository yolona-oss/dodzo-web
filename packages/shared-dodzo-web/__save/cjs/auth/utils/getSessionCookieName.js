"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionCookieName = void 0;
const constants_1 = require("../../constants");
const getSessionCookieName = (isHttps, type = 'access') => {
    const prefix = isHttps ? '__Secure-' : '';
    return `${prefix}${constants_1.Constants.AUTH_COOKIE_NAME}${type === 'refresh' ? '-refresh' : ''}`;
};
exports.getSessionCookieName = getSessionCookieName;
//# sourceMappingURL=getSessionCookieName.js.map