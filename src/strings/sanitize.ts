import type { Extends } from "@/types";
import { isString } from "@/predicates/is/isString";
import { isEmptyString } from "@/predicates/is/isEmptyString";
import { isPlainObject } from "@/predicates/is/isPlainObject";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";

type NormalizeSpacesOptions = {
  /** If `true`, skips normalization and only trims whitespace from start & end, defaultValue: `false`.
   *
   * @default false
   */
  trimOnly?: boolean;
  /** If `false`, skips trimming value, defaultValue: `true`.
   *
   * @default true
   */
  withTrim?: boolean;
};

/** ----------------------------------------------------------
 * * ***Utility: `normalizeSpaces`.***
 * ----------------------------------------------------------
 * **Normalizes whitespace in a string by reducing multiple spaces
 * to a single space, optionally trims, or only trims based on options.**
 * - **Behavior:**
 *    - Collapses all consecutive whitespace (spaces, tabs, newlines) into a single space.
 *    - Can trim leading/trailing spaces (default behavior), or preserve them with `withTrim: false`.
 *    - Can skip normalization entirely and only trim using `trimOnly: true`.
 *    - Returns an empty string if input is `null` or `undefined`.
 * @param {string | null | undefined} value - The input string to be processed. If `null` or `undefined`, returns an empty string.
 * @param {NormalizeSpacesOptions} [options] - Configuration options.
 * @param {NormalizeSpacesOptions["trimOnly"]} [options.trimOnly=false] - If `true`, skips normalization and only trims the string.
 * @param {NormalizeSpacesOptions["withTrim"]} [options.withTrim=true] - If `false`, preserves leading/trailing whitespace.
 * @returns {string} The processed string.
 * @example
 * normalizeSpaces("   Hello    World\tthis   is\n\nok ");
 * // ➔ "Hello World this is ok"
 * normalizeSpaces("   Hello    World\tthis   is\n\nok ", { trimOnly: true });
 * // ➔ "Hello    World	this   is\n\nok"
 * normalizeSpaces("   Hello    World   ", { withTrim: false });
 * // ➔ " Hello World "
 * normalizeSpaces(null);
 * // ➔ ""
 */
export const normalizeSpaces = (
  value: string | null | undefined,
  options: NormalizeSpacesOptions = {
    withTrim: true,
    trimOnly: false
  }
): string => {
  if (!isNonEmptyString(value)) return "";

  if (!isPlainObject(options)) {
    options = {};
  }

  const { trimOnly = false, withTrim = true } = options;

  if (trimOnly) return value.trim();

  if (withTrim) {
    value = value.trim();
  }

  // Remove all duplicate spaces (including tabs, newlines, etc.)
  return value.replace(/\s+/g, " ");
};

/** ----------------------------------------------------------
 * * ***Utility: `normalizeString`.***
 * ----------------------------------------------------------
 * **Normalizes a string by ensuring it is a valid string and trimming whitespace.**
 * - **Behavior:**
 *    - If the input is `undefined`, `null`, or an `empty string` after trimming,
 *      it returns an empty string `("")`.
 * @param {string | undefined | null} input - The input string to be normalize. If `null` or `undefined`, returns an empty string.
 * @returns {string} A trimmed string or an empty string if the input is invalid.
 * @example
 * normalizeString("   Hello World   ");
 * // ➔ "Hello World"
 * normalizeString("   Hello    World   ");
 * // ➔ "Hello    World"
 * normalizeString("");
 * // ➔ ""
 * normalizeString(null);
 * // ➔ ""
 * normalizeString(undefined);
 * // ➔ ""
 */
export const normalizeString = (input: string | null | undefined): string => {
  return isNonEmptyString(input) ? input.trim() : "";
};

type RemoveSpacesOptions = {
  /** If `true`, only trims the string, defaultValue: `false`.
   *
   * @default false */
  trimOnly?: boolean;
};

/** ----------------------------------------------------------
 * * ***Utility: `removeSpaces`.***
 * ----------------------------------------------------------
 * **Removes all spaces from a string or trims only, based on the options provided.**
 * - **Behavior:**
 *    - If `trimOnly` is `true`, the string is simply trimmed.
 *    - Otherwise, removes **all spaces**, tabs, newlines, etc.
 *    - If the input is `null` or `undefined`, returns an empty string `("")`.
 * @param {string | null | undefined} value - The input string to be processed. If `null` or `undefined`, returns an empty string.
 * @param {RemoveSpacesOptions} [options] - The options object.
 * @param {RemoveSpacesOptions["trimOnly"]} [options.trimOnly=false] - If `true`, only trims the string without removing spaces inside.
 * @returns {string} The processed string.
 * @example
 * removeSpaces("  Hello   World  ");
 * // ➔ "HelloWorld"
 * removeSpaces("  Hello   World  ", { trimOnly: true });
 * // ➔ "Hello   World"
 * removeSpaces(null);
 * // ➔ ""
 */
export const removeSpaces = (
  value: string | null | undefined,
  options: RemoveSpacesOptions = {
    trimOnly: false
  }
): string => {
  if (!isNonEmptyString(value)) return "";

  if (!isPlainObject(options)) {
    options = {};
  }

  const { trimOnly = false } = options;

  if (trimOnly) return value.trim();

  // Remove all spaces (including tabs, newlines, etc.)
  return value.replace(/\s+/g, "");
};

/** ----------------------------------------------------------
 * * ***Utility: `stripHtmlTags`.***
 * ----------------------------------------------------------
 * **This function removes valid HTML tags (including nested and self-closing ones)
 * by replacing them with spaces, then collapses multiple whitespaces into a single space.**
 * - **It handles the following cases:**
 *    - If the input is not a string (`null`, `undefined`, or any non-string), it is returned as undefined.
 *    - If the input is an empty or whitespace-only string, it returns an empty string (`""`).
 *    - Otherwise, it returns the cleaned string with tags removed and normalized whitespace.
 * @template T - Input string type (string | null | undefined).
 * @param {string | null | undefined} input - A string potentially containing HTML tags.
 * @returns {string | undefined} Cleaned string if input is string, or original input otherwise.
 * @example
 * stripHtmlTags("<p>Hello</p>");
 * // ➔ "Hello"
 * stripHtmlTags("<div><b>Bold</b> text</div>");
 * // ➔ "Bold text"
 * stripHtmlTags("Line<br/>Break");
 * // ➔ "Line Break"
 * stripHtmlTags("2 < 5 and 5 > 2");
 * // ➔ "2 < 5 and 5 > 2"
 * stripHtmlTags("");
 * // ➔ ""
 * stripHtmlTags("   ");
 * // ➔ ""
 * stripHtmlTags(null);
 * // ➔ undefined
 * stripHtmlTags(undefined);
 * // ➔ undefined
 */
export function stripHtmlTags(input: string): string;
export function stripHtmlTags<T>(
  input: T
): Extends<string, T> extends true ? string | undefined : undefined;
export function stripHtmlTags(input: unknown) {
  if (!isString(input)) {
    return undefined;
  }

  if (isEmptyString(input)) {
    return "";
  }

  // return input.replace(/<[^>]*>/g, "");
  const stripped = input.replace(/<\/?[a-zA-Z][^<>]*\/?>/g, " ").trim();

  const cleaned = stripped.replace(/\s+/g, " ").trim();

  return cleaned;
}
