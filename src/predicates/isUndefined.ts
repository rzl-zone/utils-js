/** ---------------------------------------------------------
 * * ***Type guard: Checks if a value is `undefined`.***
 * ---------------------------------------------------------
 *
 * @param {unknown} val - The value to check.
 * @returns {val is undefined} Returns `true` if the value is `undefined`, otherwise `false`.
 *
 * @example
 * isUndefined(undefined); // true
 * isUndefined(null);      // false
 */
export const isUndefined = (val: unknown): val is undefined => {
  return typeof val === "undefined";
};
