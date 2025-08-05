// import { isNaN } from "./new";

/** ---------------------------------------------------------
 * * ***Type guard: Checks if a value is of type `number`.***
 * ---------------------------------------------------------
 *
 * **Note**: To exclude Infinity, -Infinity, and NaN, which are classified as numbers, use the `isFinite(...)`.
 * @param {unknown} value - The value to check.
 * @returns {boolean} Returns `true` if the value is a number (excluding NaN), otherwise `false`.
 *
 * @example
 * isNumber(42);    // true
 * isNumber(NaN);   // false
 * isNumber("42");  // false
 */
export const isNumber = (value: unknown): value is number => {
  return typeof value === "number" && !Number.isNaN(value);
};
