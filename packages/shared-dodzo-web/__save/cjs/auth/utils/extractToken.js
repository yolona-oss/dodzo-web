"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractToken = void 0;
const constants_1 = require("./../../constants");
const httpUtils_1 = require("../../utils/httpUtils");
/**
 * Retrieves the value of a cookie by its name; compatible with several frameworks, i.e. native, Next.js, Express.
 *
 * @param cookies - The cookies object.
 * @param cookieName - The name of the cookie to retrieve.
 * @returns The value of the cookie, or `null` if the cookie does not exist.
 */
const getCookieValue = (cookies, cookieName) => {
    if ('get' in cookies && typeof cookies.get === 'function') {
        return cookies.get(cookieName)?.value ?? null;
    }
    return cookies[cookieName] ?? null;
};
/**
 * Extracts the token from the given request authorization or cookie.
 *
 * @param request - The request object containing the token.
 * @returns The extracted token or null if not found.
 */
const extractToken = (request) => {
    const bearer = (0, httpUtils_1.getHeaderValue)(request.headers, 'authorization')?.split(' ')[1];
    if (bearer) {
        return bearer;
    }
    const cookieName = constants_1.REFRESH_TOKEN.cookie.name;
    const cookieValue = getCookieValue(request.cookies, cookieName);
    return cookieValue ?? null;
};
exports.extractToken = extractToken;
//# sourceMappingURL=extractToken.js.map