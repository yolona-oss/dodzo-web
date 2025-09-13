import { BaseRequest } from '../../utils/httpUtils';
/**
 * Represents a base cookie.
 */
export interface BaseCookie {
    name: string;
    value: string;
}
/**
 * Represents a collection of cookies.
 */
export interface BaseCookies {
    /**
   * Retrieves a cookie by name or by a `BaseCookie` object.
   * @param args - The name of the cookie or a `BaseCookie` object.
   * @returns The matching `BaseCookie` object, or `undefined` if not found.
   */
    get(...args: [name: string] | [BaseCookie]): BaseCookie | undefined;
}
/**
 * Represents a cross-framework compatible request with cookies.
 */
export interface BaseRequestWithCookies extends BaseRequest {
    cookies: Record<string, string> | BaseCookies;
}
/**
 * Extracts the token from the given request authorization or cookie.
 *
 * @param request - The request object containing the token.
 * @returns The extracted token or null if not found.
 */
export declare const extractToken: (request: BaseRequestWithCookies) => string | null;
//# sourceMappingURL=extractToken.d.ts.map