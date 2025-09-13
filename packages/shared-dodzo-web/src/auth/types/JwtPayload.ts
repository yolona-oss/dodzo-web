export interface JwtPayload {
    sub: string;
    id: string;
    customerId: string,
    email: string;
    roles: string[];
}

export interface JwtRefreshPayload {
    sub: string;
    id: string;
}
