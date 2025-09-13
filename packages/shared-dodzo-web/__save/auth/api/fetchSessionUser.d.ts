import { IAuthUser } from '../types/AuthUser';
/**
 * Fetches the session information from the authenticated user's token.
 * Uses `fetch` since supported in all environments, i.e. Edge, Node, Browser, etc.
 */
export declare const fetchSessionUser: (token: string | null) => Promise<IAuthUser>;
//# sourceMappingURL=fetchSessionUser.d.ts.map