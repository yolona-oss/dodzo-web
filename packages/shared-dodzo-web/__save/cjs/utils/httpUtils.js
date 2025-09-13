"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHostUrl = exports.isHttps = exports.getProtocol = exports.getHost = exports.isLocalHost = exports.getHeaderValue = void 0;
/**
 * Retrieves the value of a specific header key from the provided headers object.
 * If the headers object is an instance of `Headers`, it uses the `get` method to retrieve the value.
 * Otherwise, it uses the key to access the value directly from the headers object.
 * If the value is not found, it returns null.
 *
 * @param headers - The headers object from which to retrieve the value.
 * @param key - The key of the header to retrieve the value for.
 * @returns The value of the specified header key, or null if not found.
 */
const getHeaderValue = (headers, key) => {
    if ('get' in headers && typeof headers.get === 'function') {
        return headers.get(key) || null;
    }
    const normalized = key.toLowerCase();
    const matched = Object.keys(headers).find((h) => h.toLowerCase() === normalized);
    if (matched) {
        const value = headers[matched];
        return (Array.isArray(value) ? value[0] : value) || null;
    }
    return null;
};
exports.getHeaderValue = getHeaderValue;
/**
 * Checks if the provided host is a local host.
 */
const isLocalHost = (host) => (host?.startsWith('localhost') ||
    host?.startsWith('127.0.0.1') ||
    host?.startsWith('192.168.') ||
    host?.startsWith('10.0.') ||
    host?.endsWith('.local')) ??
    false;
exports.isLocalHost = isLocalHost;
/**
 * Retrieves the host URL from the request object.
 */
const getHost = (headers) => (0, exports.getHeaderValue)(headers, 'x-forwarded-host')?.split(',')[0] || (0, exports.getHeaderValue)(headers, 'host');
exports.getHost = getHost;
/**
 * Returns the protocol (http or https) based on the provided request object.
 * If the protocol cannot be determined from the request headers, it defaults to 'http' for local hosts and 'https' for remote hosts.
 */
const getProtocol = (headers) => {
    const host = (0, exports.getHost)(headers);
    const protocol = ((0, exports.getHeaderValue)(headers, 'x-forwarded-proto')?.split(',')[0] || (0, exports.getHeaderValue)(headers, 'protocol'))?.toLowerCase();
    if (protocol === 'http' || protocol === 'https') {
        return protocol;
    }
    return (0, exports.isLocalHost)(host) ? 'http' : 'https';
};
exports.getProtocol = getProtocol;
/**
 * Checks if the request is using HTTPS protocol.
 */
const isHttps = (headers) => (0, exports.getProtocol)(headers) === 'https';
exports.isHttps = isHttps;
/**
 * Returns the host URL based on the provided request object.
 * @param request - The request object containing the headers.
 * @returns The host URL in the format: `${protocol}://${host}` or `null` if the protocol or host is not found.
 */
const getHostUrl = (headers) => {
    const host = (0, exports.getHost)(headers);
    const protocol = (0, exports.getProtocol)(headers);
    return host ? `${protocol}://${host}` : null;
};
exports.getHostUrl = getHostUrl;
//# sourceMappingURL=httpUtils.js.map