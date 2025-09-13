import type { DemoConfig } from '../types/DemoConfig';
/**
 * Provisions the services module.
 */
export declare const configureServices: (config: DemoConfig) => Omit<DemoConfig, "cookies">;
/**
 * Provisions the services with an auth bearer token.
 */
export declare const configureAuthorization: (token: string | null) => void;
//# sourceMappingURL=configure.d.ts.map