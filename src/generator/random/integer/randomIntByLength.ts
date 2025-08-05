import { isInteger, isObject } from "@/predicates";
import { randomInt } from "./randomInt";

/** ----------------------------------------------------------
 * * ***Generates a random integer within a specified range of digit lengths.***
 * ----------------------------------------------------------
 *
 * @description
 * This function allows generating random integers that strictly conform to
 * a specified minimum and maximum digit length. It is useful for scenarios
 * such as generating realistic-looking IDs, codes, or random test data.
 *
 * The function ensures:
 * - `minLength` is at least 1 and not greater than `maxLength`.
 * - `maxLength` is no more than 16 (due to JavaScript's Number.MAX_SAFE_INTEGER).
 * - If `avoidZero` is `true`, ensures that `0` is never returned.
 *
 * @param {object} [options] - Configuration options.
 * @param {number} [options.minLength=1] - Minimum number of digits (must be ≥1 and ≤ `maxLength`).
 * @param {number} [options.maxLength=16] - Maximum number of digits (must be ≤16).
 * @param {boolean} [options.avoidZero=false] - If true, will ensure the result is never zero.
 *
 * @returns {number} A randomly generated integer within the specified constraints.
 *
 * @throws {Error} If parameters are invalid, such as:
 * - `minLength` < 1
 * - `maxLength` > 16
 * - `minLength` > `maxLength`
 * - non-integer values for `minLength` or `maxLength`
 *
 * @example
 * randomIntByLength({ minLength: 3, maxLength: 5 }); // → (`4829` << random), (`192` << random) or (`71492` << random).
 * randomIntByLength({ minLength: 4, maxLength: 4 }); // → `5930` (exact 4 digits)
 * randomIntByLength({ avoidZero: true });            // → never 0
 */
export const randomIntByLength = (options?: {
  /** * Minimum length of the random number, the `allowed` `minimal` `value` `integer` is `1` `and` `not` `bigger` `than` `value` `of` `maxLength`.
   * @default 1
   */
  minLength?: number;
  /** * Maximum length of the random number, the `allowed` `maximal` `value` `integer` is `16`.
   *
   * @default 16
   */
  maxLength?: number;
  /** * If true, prevents the result from being zero.
   * @default false
   */
  avoidZero?: boolean;
}): number => {
  // Ensure options is an object and Defensive options check
  if (!isObject(options)) {
    options = {};
  }

  const { minLength = 1, maxLength = 16, avoidZero = false } = options;

  // Validate minLength and maxLength
  if (
    !isInteger(minLength) ||
    !isInteger(maxLength) ||
    minLength < 1 ||
    maxLength > 16 ||
    minLength > maxLength
  ) {
    throw new Error(
      "Invalid parameters: minLength must be ≥ 1, maxLength must be ≤ 16, and minLength ≤ maxLength."
    );
  }

  // Generate a random length between minLength and maxLength
  const randomLength =
    minLength === maxLength ? minLength : randomInt(minLength, maxLength);

  // Define min and max value based on the selected length
  const minValue = 10 ** (randomLength - 1); // Example: minLength=3 → minValue=100
  const maxValue = 10 ** randomLength - 1; // Example: maxLength=4 → maxValue=9999

  // Generate a random number within the valid range
  let result = randomInt(minValue, maxValue);

  // Ensure the number is not zero if `avoidZero` is true
  if (avoidZero && result === 0) {
    result = minValue; // Assign the smallest valid number instead of looping
  }

  return result;
};
