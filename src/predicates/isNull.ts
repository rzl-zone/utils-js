/** ---------------------------------------------------------
 * * ***Type guard: Checks if a value is `null`.***
 * ---------------------------------------------------------
 *
 * @param {unknown} val - The value to check.
 * @returns {val is null} Returns `true` if the value is `null`, otherwise `false`.
 *
 * @example
 * isNull(null); // true
 * isNull(0);    // false
 */
export const isNull = (val: unknown): val is null => val === null;
