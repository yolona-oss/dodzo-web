import { JWTPayload } from 'jose';
/**
 * Verifies the authenticity of a token using a secret or key.
 */
export declare const verifyToken: (value: string | null | undefined, keyOrSecret: string, keyFormat?: "base64", algorithm?: "ES256") => Promise<JWTPayload>;
//# sourceMappingURL=verifyToken.d.ts.map