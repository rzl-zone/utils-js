import { isInteger } from "@/index";

/** ----------------------------
 * * ***Generates a random integer within a specified range (inclusive).***
 * ----------------------------
 *
 * @description
 * Generates a random integer between `min` and `max` (inclusive),
 * with safety constraints:
 * - `min` will be forced to be at least `1`.
 * - `max` will be capped at `Number.MAX_SAFE_INTEGER`.
 *
 * Validates input parameters to ensure robust behavior.
 *
 * @param {number} min - The minimum value (inclusive). Must be an integer.
 * @param {number} max - The maximum value (inclusive). Must be an integer.
 *
 * @returns {number} A random integer N where `min ≤ N ≤ max`.
 *
 * @throws {Error} If:
 * - `min` or `max` is not an integer.
 * - `min` is greater than `max`.
 *
 * @example
 * randomInt(1, 10);  // → returns 1 to 10
 * randomInt(50, 100); // → returns 50 to 100
 * randomInt(5, 5);    // → always returns 5
 *
 * @example
 * randomInt(-5, 3);   // → always returns ≥ 1, since min is adjusted
 *
 * @example
 * randomInt(1, Number.MAX_SAFE_INTEGER + 10000);
 * // → still safely capped at MAX_SAFE_INTEGER
 */
export const randomInt = (min: number, max: number): number => {
  if (!isInteger(min) || !isInteger(max)) {
    throw new Error(
      "Error function of `getRandomIntInRange` both parameter `min` and `max` must be integers."
    );
  }
  if (min > max) {
    throw new Error(
      "Error function of `getRandomIntInRange` parameter `min` must be less than or equal to `max`."
    );
  }

  // Ensure `min` is at least 1
  min = Math.max(1, min);

  // Ensure `max` does not exceed Number.MAX_SAFE_INTEGER
  max = Math.min(Number.MAX_SAFE_INTEGER, max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};
