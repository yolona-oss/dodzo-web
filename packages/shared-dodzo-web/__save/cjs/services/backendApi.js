"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.backendApi = void 0;
const axios_1 = __importDefault(require("axios"));
const currentUrl_1 = require("../utils/currentUrl");
/**
 * Instance for making backend API requests.
 */
exports.backendApi = axios_1.default.create({
    adapter: 'fetch',
    withCredentials: true
});
// The current URL and workspace is added to all request headers via interceptor.
exports.backendApi.interceptors.request.use((config) => {
    const newConfig = config;
    const url = (0, currentUrl_1.currentUrl)();
    if (url) {
        newConfig.headers['x-current-url'] = url.href;
    }
    return newConfig;
}, (error) => Promise.reject(error));
//# sourceMappingURL=backendApi.js.map