export interface IAuthUser {
    id: string;
    username: string;
    email: string;
    phone?: string;
    createdAt: Date;
    updatedAt: Date;
    roles: string[];
}
/**
 * Type guard for determining whether a value is an authenticated user.
 */
export declare const isAuthUser: (value: unknown) => value is IAuthUser;
//# sourceMappingURL=AuthUser.d.ts.map