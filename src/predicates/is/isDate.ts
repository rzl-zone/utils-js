import { isNaN } from "./isNaN";

/** ----------------------------------------------------------
 * * ***Type guard: `isDate`.***
 * ----------------------------------------------------------
 * **Determines whether the given `value` is a real, valid JavaScript
 *   **[`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)** object.**
 * - **Behavior:**
 *    - Checks if value is an instance of `Date`.
 *    - Ensures the `date` is valid (`!isNaN(date.getTime())`).
 *    - Returns `false` for `strings` or `invalid date objects`.
 * @param {*} value - The value to check.
 * @returns {boolean} Return `true` if value is a valid Date object.
 * @example
 * isDate(new Date());
 * // ➔ true
 * isDate(new Date("invalid"));
 * // ➔ false
 * isDate("2024-01-01");
 * // ➔ false
 */
export const isDate = (value: unknown): value is Date => {
  return value instanceof Date && !isNaN(value.getTime());
};
