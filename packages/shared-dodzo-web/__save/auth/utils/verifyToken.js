import { errors, importSPKI, jwtVerify } from 'jose';
/**
 * Verifies the authenticity of a token using a secret or key.
 */
export const verifyToken = async (value, keyOrSecret, keyFormat = 'base64', algorithm = 'ES256') => {
    const parsedKey = keyFormat === 'base64' ? Buffer.from(keyOrSecret, 'base64').toString('utf-8') : keyOrSecret;
    const publicKey = await importSPKI(parsedKey, algorithm);
    const decoded = await jwtVerify(value ?? '', publicKey, { algorithms: [algorithm] });
    if (!decoded) {
        throw new errors.JOSEError('Token verification failed');
    }
    return decoded.payload;
};
//# sourceMappingURL=verifyToken.js.map