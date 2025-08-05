import { parseCurrencyString } from "@/conversions";
import { isString } from "./isString";
import { isNumber } from "./isNumber";

/** -----------------------------------------------------------
 * * Checks whether an input looks like a currency or number string,
 * * using the same smart multi-locale parsing logic as `parseCurrencyString`.
 * -----------------------------------------------------------
 *
 * ✅ Highlights:
 * - Supports strings or numbers like:
 *   - "15.000,10"  (European)
 *   - "15,000.10"  (US)
 *   - "15'000.10"  (Swiss)
 *   - "15 000,10"  (French)
 *   - "Rp 15.000,10" or "$15,000.10"
 * - Also accepts simple numbers (15300.95).
 *
 * 🚀 Uses the same core logic as `parseCurrencyString` but
 * just checks if a final parsed float is sensible.
 *
 * @param {string|number} input
 *   The input value to check.
 *
 * @returns {boolean}
 *   `true` if it can be reasonably parsed into a currency-like number,
 *   `false` otherwise.
 *
 * @example
 * isCurrencyLike("Rp 15.000,10");
 * // ➔ true
 *
 * isCurrencyLike("$15,000.10");
 * // ➔ true
 *
 * isCurrencyLike("(15'000.10)");
 * // ➔ true
 *
 * isCurrencyLike("abc");
 * // ➔ false
 *
 * isCurrencyLike(15300.95);
 * // ➔ true
 *
 * isCurrencyLike("");
 * // ➔ false
 */
export const isCurrencyLike = (input: string | number): boolean => {
  if (!(isString(input) || isNumber(input))) return false;

  const parsed = parseCurrencyString(input.toString());
  // If parseCurrencyString returns a meaningful number (not just fallback zero for empty/invalid input)
  if (parsed !== 0) return true;

  // Special case: if input was exactly "0", still valid
  return input.toString().trim() === "0";
};
