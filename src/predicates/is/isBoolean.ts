/** ----------------------------------------------------------
 * * ***Type guard: `isBoolean`.***
 * ----------------------------------------------------------
 * **Checks if a value is of type boolean.**
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the value is a **[`boolean`](https://developer.mozilla.org/en-US/docs/Glossary/Boolean/JavaScript)**, otherwise `false`.
 * @example
 * isBoolean(true);   // ➔ true
 * isBoolean(false);  // ➔ true
 * isBoolean("true"); // ➔ false
 */
export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === "boolean";
};
