/** ---------------------------------------------------------
 * * ***Type guard: Checks if a value is of type `string`.***
 * ---------------------------------------------------------
 *
 * This function is a type guard that determines if the provided value
 * is a `string`. It can be used to narrow types in TypeScript.
 *
 * @param {unknown} value - The value to check.
 * @returns {boolean} `true` if the value is a string, otherwise `false`.
 *
 * @example
 * isString("hello"); // true
 * isString(123);     // false
 *
 * // Usage in type narrowing
 * const value: unknown = getValue();
 * if (isString(value)) {
 *   // TypeScript now knows `value` is a string
 *   console.log(value.toUpperCase());
 * }
 */
export const isString = (value: unknown): value is string => {
  return typeof value === "string";
};
