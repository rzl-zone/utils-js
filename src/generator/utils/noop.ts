/** --------------------------------------------------
 * * ***A no-operation function that always returns `undefined`.***
 * --------------------------------------------------
 * **Useful as a default callback, placeholder, or stub function.**
 * @returns {undefined} Always returns `undefined`.
 * @example
 * // Direct call returns undefined
 * noop();
 * // ➔ undefined
 *
 * // Can be used with type-checking helpers
 * isUndefined(noop());  // ➔ true
 * isFunction(noop);     // ➔ true
 * isFunction(noop());   // ➔ false
 *
 * // Often used as a default function
 * const callback = noop;
 * callback();
 * // ➔ undefined
 */
export const noop = (): void => {};
