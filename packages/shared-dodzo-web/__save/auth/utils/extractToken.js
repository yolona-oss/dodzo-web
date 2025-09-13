import { REFRESH_TOKEN } from './../../constants';
import { getHeaderValue } from '../../utils/httpUtils';
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
export const extractToken = (request) => {
    const bearer = getHeaderValue(request.headers, 'authorization')?.split(' ')[1];
    if (bearer) {
        return bearer;
    }
    const cookieName = REFRESH_TOKEN.cookie.name;
    const cookieValue = getCookieValue(request.cookies, cookieName);
    return cookieValue ?? null;
};
//# sourceMappingURL=extractToken.js.map