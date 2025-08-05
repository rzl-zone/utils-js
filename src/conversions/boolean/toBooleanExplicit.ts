import { isBoolean, isNil, isNumber, isString } from "@/index";

/** ---------------------------------
 * * ***Converts a value into a strict boolean.***
 * ---------------------------------
 *
 * This function checks if the input is a valid representation of `true`
 * (e.g., `"true"`, `"on"`, `"yes"`, `"1"`, `1`, `true`, `"indeterminate"`).
 * Any other value, including `undefined` and `null`, will return `false`.
 *
 * Supports optional `caseInsensitive` and `trimString` to customize string normalization.
 *
 * @param {unknown} [value] - The value to convert.
 * @param {Object} [options] - Options for conversion behavior.
 * @param {boolean} [options.caseInsensitive=false] - Whether string comparison ignores case. Default: `false`.
 * @param {boolean} [options.trimString=true] - Whether to trim whitespace before comparison. Default: `true`.
 * @returns {boolean} `true` if the value matches a truthy representation, otherwise `false`.
 *
 * @example
 * toBooleanExplicit(true) // true
 * toBooleanExplicit("on") // true
 * toBooleanExplicit("Yes") // false
 * toBooleanExplicit(" YES ", { trimString: false }) // false
 * toBooleanExplicit(" YES ", { trimString: true, caseInsensitive: true }) // true
 * toBooleanExplicit(" YES ", { trimString: true, caseInsensitive: false }) // false
 * toBooleanExplicit("yes", { caseInsensitive: false }) // true
 * toBooleanExplicit("1") // true
 * toBooleanExplicit(1) // true
 * toBooleanExplicit(0) // false
 * toBooleanExplicit("off") // false
 */
export const toBooleanExplicit = (
  value?: unknown,
  options?: {
    /** Whether string comparison ignores case. Default: `false`.
     *
     * @default false
     */
    caseInsensitive?: boolean;
    /** Whether to trim whitespace before comparison. Default: `true`.
     *
     * @default true
     */
    trimString?: boolean;
  }
): boolean => {
  if (isNil(value)) return false;

  const ci =
    options && "caseInsensitive" in options ? options.caseInsensitive : false;
  const ts = options && "trimString" in options ? options.trimString : true;

  if (!isBoolean(ci)) {
    throw new TypeError(`props 'caseInsensitive' must be \`boolean\` type!`);
  }
  if (!isBoolean(ts)) {
    throw new TypeError(`props 'trimString' must be \`boolean\` type!`);
  }

  if (isString(value)) {
    let normalized = value;
    if (ts) normalized = normalized.trim();
    if (ci) normalized = normalized.toLowerCase();
    return ["true", "on", "yes", "1", "indeterminate"].includes(normalized);
  }

  if (isNumber(value)) return value === 1;
  if (isBoolean(value)) return value;

  return false;
};
