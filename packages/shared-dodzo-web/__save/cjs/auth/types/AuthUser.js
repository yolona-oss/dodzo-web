"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthUser = void 0;
/**
 * Type guard for determining whether a value is an authenticated user.
 */
const isAuthUser = (value) => typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'string' &&
    'createdAt' in value &&
    'updatedAt' in value;
exports.isAuthUser = isAuthUser;
//# sourceMappingURL=AuthUser.js.map