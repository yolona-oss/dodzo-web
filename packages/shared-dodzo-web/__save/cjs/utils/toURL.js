"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toURL = void 0;
/**
 * Returns a URL object if the value is a valid URL, otherwise returns null.
 */
const toURL = (value) => {
    if (value instanceof URL) {
        return value;
    }
    if (typeof value !== 'string' || !value) {
        return null;
    }
    try {
        const url = new URL(value);
        return url.hostname ? url : null;
    }
    catch {
        return null;
    }
};
exports.toURL = toURL;
//# sourceMappingURL=toURL.js.map