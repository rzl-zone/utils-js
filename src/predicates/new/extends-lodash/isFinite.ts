/** -----------------------------------------------------------------------------
 * * Checks if `value` is a finite number (not `Infinity`, `-Infinity`, or `NaN`).
 * -----------------------------------------------------------------------------
 *
 * This method is based on
 * [`Number.isFinite()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite).
 * It returns `true` only for values that are of type `number` and are finite.
 *
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if `value` is a finite number, else `false`.
 *
 * @example
 *
 * isFinite(3);
 * // => true
 *
 * isFinite(Number.MIN_VALUE);
 * // => true
 *
 * isFinite(Infinity);
 * // => false
 *
 * isFinite("3");
 * // => false
 */
export function isFinite(value?: unknown): boolean {
  return typeof value === "number" && Number.isFinite(value);
}
