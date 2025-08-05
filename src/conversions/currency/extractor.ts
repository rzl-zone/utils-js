import { isNumber, isString } from "@/predicates";

/** * ----------------------------------------------------------
 * * ***Extracts digits from a string or number input.***
 * ----------------------------------------------------------
 *
 * ✅ Converts the input to a string, trims whitespace, and removes any characters
 *    that are not digits (`0-9`).
 *
 * ✅ Returns the cleaned numeric value as a `number`.
 *
 * 🚩 If the input is `null`, `undefined`, or results in no digits,
 *    it safely returns `0`.
 *
 * @param {string | number | null | undefined} value
 *    The value to process. Accepts a string, number, `null`, or `undefined`.
 *
 * @returns {number}
 *    The numeric value after extracting digits.
 *    Returns `0` if input is invalid or contains no digits.
 *
 * @example
 * extractDigits("123abc456"); // ➔ 123456
 * extractDigits("$1,234.56"); // ➔ 123456
 * extractDigits("9A8B7C6");   // ➔ 9876
 * extractDigits("abc");       // ➔ 0
 * extractDigits(undefined);   // ➔ 0
 * extractDigits(null);        // ➔ 0
 * extractDigits(12345);       // ➔ 12345
 * extractDigits("   00a  ");  // ➔ 0
 */
export const extractDigits = (value?: string | number | null): number => {
  if (!isString(value) && !isNumber(value)) return 0;

  const cleaned = String(value)
    .trim()
    .replace(/[^0-9]/g, "");
  return Number(cleaned) || 0;
};
