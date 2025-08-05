/** ----------------------------------------------------
 * * ***Checks if `value` is classified as an `ArrayBuffer` object.***
 * ----------------------------------------------------
 *
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array buffer, else `false`.
 *
 * @example
 *
 * isArrayBuffer(new ArrayBuffer(2));
 * // => true
 *
 * isArrayBuffer(new Array(2));
 * // => false
 */
export function isArrayBuffer(value: unknown): value is ArrayBuffer {
  return value instanceof ArrayBuffer;
}
