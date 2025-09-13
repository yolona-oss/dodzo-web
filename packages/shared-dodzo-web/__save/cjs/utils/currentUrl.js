"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentUrl = void 0;
const toURL_1 = require("./toURL");
/**
 * Returns the current URL with optional search parameters updated.
 * If `window` is not defined due to server-side execution, this function will return `null`.
 */
const currentUrl = (params) => {
    const url = typeof window !== 'undefined' ? (0, toURL_1.toURL)(window.location?.href) : null;
    if (!url) {
        return null;
    }
    Object.entries(params || {}).forEach(([key, value]) => {
        if (value === '' || value === null || value === undefined) {
            url.searchParams.delete(key);
            return;
        }
        url.searchParams.set(key, value);
    });
    return url;
};
exports.currentUrl = currentUrl;
//# sourceMappingURL=currentUrl.js.map