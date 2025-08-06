/** --------------------------------------------------
 * * ***Checks if `value` is a safe integer. An integer is safe if it's an IEEE-754 double precision number which isn't the result of a rounded unsafe integer.***
 * --------------------------------------------------
 *
 * **Note:** This method is based on
 * [`Number.isSafeInteger`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger).
 *
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a safe integer, else `false`.
 * @example
 *
 * isSafeInteger(3);
 * // => true
 *
 * isSafeInteger(Number.MIN_VALUE);
 * // => false
 *
 * isSafeInteger(Infinity);
 * // => false
 *
 * isSafeInteger('3');
 * // => false
 */
export function isSafeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value);
}
