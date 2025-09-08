import { isNumber } from "@/predicates/is/isNumber";
import { isInteger } from "@/predicates/is/isInteger";
import { getPreciseType } from "@/predicates/type/getPreciseType";
import { safeStableStringify } from "@/conversions/stringify/safeStableStringify";

/** -----------------------------------------------------------------------
 * * ***Generates a random integer within a specified range (inclusive).***
 * ------------------------------------------------------------------------
 * Generates a random integer between `min` and `max` (inclusive), with safety constraints:
 * - `min` will be forced to be at least `1`.
 * - `max` will be capped at `Number.MAX_SAFE_INTEGER`.
 *
 * Validates input parameters to ensure robust behavior.
 * @param {number} min - The minimum value (inclusive), must be an integer.
 * @param {number} max - The maximum value (inclusive), must be an integer.
 * @returns {number} A random integer N where `min ≤ N ≤ max`.
 * @throws {TypeError} If:
 * - `min` or `max` is not an integer and value is `Number.MIN_VALUE`.
 * - `min` is greater than `max`.
 * @example
 * randomInt(1, 10);   // ➔ returns 1 to 10
 * randomInt(50, 100); // ➔ returns 50 to 100
 * randomInt(5, 5);    // ➔ always returns 5
 * randomInt(-5, 3);   // ➔ always returns ≥ 1, since min is adjusted
 * randomInt(1, Number.MAX_SAFE_INTEGER + 10000);
 * // ➔ still safely capped at MAX_SAFE_INTEGER
 * randomInt(Number.MIN_VALUE, 3);
 * // ➔ Error, min or max cant be as `Number.MIN_VALUE` value.
 */
export const randomInt = (min: number, max: number): number => {
  if (!isInteger(min) || !isInteger(max)) {
    throw new TypeError(
      `First parameter (\`min\`) and second parameter (\`max\`) must be of type \`integer-number\`${minValueNote(
        min,
        max
      )}value, but received: ['min': \`${getPreciseType(
        min
      )}\` - (with value: \`${safeStableStringify(min)})\`, 'max': \`${getPreciseType(
        max
      )}\` - (with value: \`${safeStableStringify(max)}\`)].`
    );
  }
  if (min > max) {
    throw new RangeError(
      `First parameter (\`min\`) must be less than or equal to second parameter (\`max\`), but received: ['min': ${formatValue(
        min
      )}, 'max': ${formatValue(max)}].`
    );
  }

  // Ensure `min` is at least 1
  min = Math.max(1, min);

  // Ensure `max` does not exceed Number.MAX_SAFE_INTEGER
  max = Math.min(Number.MAX_SAFE_INTEGER, max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const formatValue = (value: unknown): string => {
  return isNumber(value, { includeNaN: true })
    ? value === Number.MIN_VALUE
      ? "`Number.MIN_VALUE`"
      : `${value}`
    : `\`${getPreciseType(value)}\``;
};

const minValueNote = (...values: unknown[]) => {
  return values.some((v) => isNumber(v, { includeNaN: true }) && v === Number.MIN_VALUE)
    ? " and can't be `Number.MIN_VALUE` "
    : " ";
};
