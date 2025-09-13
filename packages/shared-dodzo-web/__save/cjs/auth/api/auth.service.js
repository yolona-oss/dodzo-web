"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refreshToken = exports.signUp = exports.signIn = void 0;
const backendApi_1 = require("../../services/backendApi");
const signIn = async (credentials) => {
    const response = await backendApi_1.backendApi.post(`auth/login`, credentials);
    return response.data;
};
exports.signIn = signIn;
const signUp = async (credentials) => {
    console.log(credentials);
    const response = await backendApi_1.backendApi.post('auth/signup', credentials);
    return response.data;
};
exports.signUp = signUp;
const refreshToken = async (token) => {
    const response = await backendApi_1.backendApi.post(`auth/refresh`, { token });
    return response.data;
};
exports.refreshToken = refreshToken;
const logout = async () => {
    const response = await backendApi_1.backendApi.post('auth/logout');
    return response.data;
};
exports.logout = logout;
//# sourceMappingURL=auth.service.js.map