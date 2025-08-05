import { isObject } from "./isObject";
import { isString } from "./isString";

/**
 * ----------------------------------------------------------
 * * ***Type guard: Checks if a value is a non-empty string.***
 * ----------------------------------------------------------
 *
 * Determines whether the given `value` is a string containing at least one non-whitespace character,
 * with optional trimming behavior.
 *
 * - ✅ Validates that `value` is a string.
 * - ✅ Optionally trims the string before checking (`trim` defaults to `true`).
 * - ✅ Returns `true` only if the resulting string is not empty.
 *
 * @param value - The value to test.
 * @param options - Optional settings.
 * @param options.trim - If `true`, trims the string before checking. Defaults to `true`.
 *
 * @returns `true` if `value` is a non-empty string, otherwise `false`.
 *
 * @example
 * isNonEmptyString("hello"); // true
 * isNonEmptyString("   ", { trim: true }); // false
 * isNonEmptyString("   ", { trim: false }); // true
 * isNonEmptyString(""); // false
 * isNonEmptyString(123); // false
 * isNonEmptyString(undefined); // false
 * isNonEmptyString(null); // false
 * isNonEmptyString({}); // false
 * isNonEmptyString([]); // false
 */
export const isNonEmptyString = (
  value: unknown,
  options?: {
    trim?: boolean;
  }
): value is string => {
  if (!isString(value)) return false;

  if (!isObject(options)) {
    options = {};
  }

  const { trim = true } = options;

  const str = trim ? value.trim() : value;

  return str.length > 0;
};
