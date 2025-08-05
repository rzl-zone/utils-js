import { isString } from "@/predicates";

/** ----------------------------------------------------------
 * * ***Converts a value from a string to its natural JavaScript type.***
 * ----------------------------------------------------------
 *
 * ✅ Supported conversions:
 * - `"true"`      → `true`
 * - `"false"`     → `false`
 * - `"null"`      → `null`
 * - `"undefined"` → `undefined`
 * - `"42"`        → `42` (number)
 * - `"3.14"`      → `3.14` (number)
 * - `"3,567,890.14"`      → `3567890.14` (number)
 * - `"   "`       → `""` (trimmed)
 * - Other strings are returned trimmed & lowercased.
 * - Non-string inputs are returned unchanged.
 *
 * @example
 * convertType("true")       // → true
 * convertType(" 42 ")       // → 42
 * convertType("FALSE")      // → false
 * convertType(" null ")     // → null
 * convertType("   ")        // → ""
 * convertType(100)          // → 100
 * convertType({})           // → {}
 *
 * @param {any} value - The value to convert (usually string or unknown type).
 * @returns {any} The converted JavaScript type (boolean, number, null, undefined, or original).
 */
export const convertType = (value: unknown): unknown => {
  const predefinedValues: Record<string, unknown> = {
    undefined: undefined,
    null: null,
    true: true,
    false: false,
    yes: true,
    no: false,
  };

  if (isString(value)) {
    const normalized = value.trim().toLowerCase();

    if (Object.prototype.hasOwnProperty.call(predefinedValues, normalized)) {
      return predefinedValues[normalized];
    }

    // Support numbers with thousand separators
    const numericString = normalized.replace(/,/g, "");

    if (!isNaN(Number(numericString)) && numericString !== "") {
      return Number(numericString);
    }

    return normalized;
  }

  return value;
};
