import { isObject, isString } from "@/predicates";

/** ----------------------------------------------------------
 * * ***Checks whether a given value is an empty string.***
 * ----------------------------------------------------------
 *
 * This utility checks if a string is empty (`""`) or consists only of whitespace
 * (if `trim` is enabled, which is the default). Non-string inputs are considered empty.
 *
 * @param {string} [value] - The value to check.
 * @param {Object} [options] - Optional settings.
 * @param {boolean} [options.trim=true] - Whether to trim the string before checking, defaultValue `true`.
 * @returns {boolean} - Returns `true` if the value is string not a string or value string is considered empty.
 *
 * @example
 * isEmptyString("");                         // true
 * isEmptyString("   ");                      // true (default trims)
 * isEmptyString("   ", { trim: false });     // false
 * isEmptyString("hello");                    // false
 * isEmptyString(undefined);                  // true
 * isEmptyString(null);                       // true
 * isEmptyString(123 as any);                 // true
 *
 * @example
 * // Used in validation
 * if (isEmptyString(form.name)) {
 *   throw new Error("Name cannot be empty.");
 * }
 */
export const isEmptyString = (
  value?: string | null,
  options?: {
    /**
     * Whether to trim the string before checking.
     *
     * @default `true` */
    trim?: boolean;
  }
): boolean => {
  if (!isString(value)) return true;

  if (!isObject(options)) {
    options = {};
  }

  const { trim = true } = options;

  if (trim) {
    value = value.trim();
  }
  return value === "";
};
