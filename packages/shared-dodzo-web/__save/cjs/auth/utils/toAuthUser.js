"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toAuthUser = void 0;
const toAuthUser = (user) => ({
    id: user.id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    roles: user.roles,
});
exports.toAuthUser = toAuthUser;
//# sourceMappingURL=toAuthUser.js.map