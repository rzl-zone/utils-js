/** ----------------------------------------------------
 * * ***Checks if `value` is a integer.***
 * ----------------------------------------------------
 *
 * **Note:** This method is based on
 * [`Number.isInteger`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger).
 *
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an integer, else `false`.
 * @example
 *
 * isInteger(3);
 * // => true
 *
 * isInteger(Number.MIN_VALUE);
 * // => false
 *
 * isInteger(Infinity);
 * // => false
 *
 * isInteger('3');
 * // => false
 */
export function isInteger(value?: unknown): boolean {
  return typeof value === "number" && Number.isInteger(value);
}
