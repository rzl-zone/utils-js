/* eslint-disable @typescript-eslint/no-explicit-any */

/** --------------------------------------------------
 * * ***Checks if `value` is classified as a `Set` object.***
 * --------------------------------------------------
 *
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 * @example
 *
 * isSet(new Set);
 * // => true
 *
 * isSet(new WeakSet);
 * // => false
 */
export function isSet(value: unknown): value is Set<any> {
  return (
    Object.prototype.toString.call(value) === "[object Set]" ||
    value instanceof Set
  );
}
