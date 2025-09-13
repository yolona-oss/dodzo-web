"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jose_1 = require("jose");
/**
 * Verifies the authenticity of a token using a secret or key.
 */
const verifyToken = async (value, keyOrSecret, keyFormat = 'base64', algorithm = 'ES256') => {
    const parsedKey = keyFormat === 'base64' ? Buffer.from(keyOrSecret, 'base64').toString('utf-8') : keyOrSecret;
    const publicKey = await (0, jose_1.importSPKI)(parsedKey, algorithm);
    const decoded = await (0, jose_1.jwtVerify)(value ?? '', publicKey, { algorithms: [algorithm] });
    if (!decoded) {
        throw new jose_1.errors.JOSEError('Token verification failed');
    }
    return decoded.payload;
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=verifyToken.js.map