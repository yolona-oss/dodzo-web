/**
 * Type guard for determining whether a value is an authenticated user.
 */
export const isAuthUser = (value) => typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'string' &&
    'createdAt' in value &&
    'updatedAt' in value;
//# sourceMappingURL=AuthUser.js.map