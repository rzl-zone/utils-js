/** ----------------------------------------
 * * ***Checks if `value` is a valid array-like length.***
 * ----------------------------------------
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * isLength(3); // => true
 * isLength(Number.MIN_VALUE); // => false
 * isLength(Infinity); // => false
 * isLength('3'); // => false
 * isLength(4294967296); // => true
 *
 */
export function isLength(value: unknown): boolean {
  return (
    typeof value === "number" &&
    value > -1 &&
    Number.isInteger(value) &&
    value <= Number.MAX_SAFE_INTEGER
  );
}
