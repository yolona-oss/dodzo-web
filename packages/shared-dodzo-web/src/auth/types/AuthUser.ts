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
export const isAuthUser = (value: unknown): value is IAuthUser =>
    typeof value === 'object' &&
        value !== null &&
        'id' in value &&
        typeof value.id === 'string' &&
        'createdAt' in value &&
        'updatedAt' in value;
