import { AppId } from '../types/AppId';
import { DemoEnvironment } from '../types/DemoEnvironment';
/**
 * Returns the app name for the given app.
 */
export declare const appName: (appId: AppId) => string;
/**
 * Returns the API url for the given app and environment.
 */
export declare const apiUrl: (appId: AppId, environment: DemoEnvironment) => string;
/**
 * Returns the app url for the given app and environment.
 */
export declare const appUrl: (appId: AppId, environment: DemoEnvironment) => string;
//# sourceMappingURL=appUtils.d.ts.map