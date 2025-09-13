import { backendApi } from '../../services/backendApi';
export const signIn = async (credentials) => {
    const response = await backendApi.post(`auth/login`, credentials);
    return response.data;
};
export const signUp = async (credentials) => {
    console.log(credentials);
    const response = await backendApi.post('auth/signup', credentials);
    return response.data;
};
export const refreshToken = async (token) => {
    const response = await backendApi.post(`auth/refresh`, { token });
    return response.data;
};
export const logout = async () => {
    const response = await backendApi.post('auth/logout');
    return response.data;
};
//# sourceMappingURL=auth.service.js.map