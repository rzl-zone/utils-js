/** ---------------------------------------------------------
 * * ***Type guard: Checks if a value is an instance of the `URL` class.***
 * ---------------------------------------------------------
 *
 * @param {unknown} val - The value to check.
 * @returns {val is URL} Returns `true` if the value is a `URL` instance, otherwise `false`.
 *
 * @example
 * isURL(new URL("https://example.com")); // true
 * isURL("https://example.com");          // false
 */
export const isURL = (val: unknown): val is URL => {
  return val instanceof URL;
};
