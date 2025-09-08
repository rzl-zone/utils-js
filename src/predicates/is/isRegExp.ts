/** ----------------------------------------------------------
 * * ***Type guard: `isRegExp`.***
 * ----------------------------------------------------------
 * **Checks if a value is a RegExp instance.**
 * @param {*} value - The value to check.
 * @returns {boolean} Return `true` if value is an instance of **[RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)**.
 * @example
 * isRegExp(/abc/);             // ➔ true
 * isRegExp(new RegExp("abc")); // ➔ true
 * isRegExp("abc");             // ➔ false
 */
export const isRegExp = (value: unknown): value is RegExp => {
  return value instanceof RegExp;
};
