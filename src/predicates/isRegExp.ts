/** ----------------------------------------------------------
 * * ***Type guard: Checks if a value is a RegExp instance.***
 * ----------------------------------------------------------
 *
 * @param value - The value to check.
 * @returns {boolean} - `true` if value is an instance of RegExp.
 *
 * @example
 * isRegExp(/abc/); // true
 * isRegExp(new RegExp("abc")); // true
 * isRegExp("abc"); // false
 */
export const isRegExp = (value: unknown): value is RegExp => {
  return value instanceof RegExp;
};
