/**
 * Type guard for filtering out `null` and `undefined` values.
 *
 * @example
 * [0, 1, null, 3].filter(isDefined); // [0, 1, 3]
 */
export declare const isDefined: <T>(value: T | null) => value is T;
//# sourceMappingURL=isDefined.d.ts.map