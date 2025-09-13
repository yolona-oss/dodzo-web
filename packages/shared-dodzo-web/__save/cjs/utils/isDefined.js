"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDefined = void 0;
/**
 * Type guard for filtering out `null` and `undefined` values.
 *
 * @example
 * [0, 1, null, 3].filter(isDefined); // [0, 1, 3]
 */
const isDefined = (value) => value != null;
exports.isDefined = isDefined;
//# sourceMappingURL=isDefined.js.map