"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REQUSET_USER_KEY = exports.RESET_PASSWORD_TOKEN = exports.REFRESH_TOKEN = void 0;
exports.REFRESH_TOKEN = {
    //secret: process.env.AUTH_REFRESH_TOKEN_SECRET,
    cookie: {
        name: "refreshTkn",
        options: {
            sameSite: false,
            secure: true,
            httpOnly: false,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
    },
};
exports.RESET_PASSWORD_TOKEN = {
    expiry: 5 * 60 * 1000, // 5 minutes
};
exports.REQUSET_USER_KEY = 'user';
//# sourceMappingURL=constants.js.map