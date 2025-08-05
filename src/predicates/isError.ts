/** ----------------------------------------------------------
 * * ***Checks if a given value is an instance of the `Error` object.***
 * ----------------------------------------------------------
 *
 * - ✅ This function helps ensure that the provided value is a valid JavaScript error.
 * - ✅ Useful for error handling in TypeScript.
 *
 * @param {unknown} error - The value to check.
 * @returns {boolean} - Returns `true` if the value is an `Error`, otherwise `false`.
 *
 * @example
 * isError(new Error("Something went wrong")); // true
 * isError("Error message"); // false
 * isError(null); // false
 */
export const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};
