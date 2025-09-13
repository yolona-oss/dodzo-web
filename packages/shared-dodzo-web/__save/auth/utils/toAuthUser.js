export const toAuthUser = (user) => ({
    id: user.id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    roles: user.roles,
});
//# sourceMappingURL=toAuthUser.js.map