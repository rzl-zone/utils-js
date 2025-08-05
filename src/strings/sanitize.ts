import {
  isEmptyString,
  isNonEmptyString,
  isObject,
  isString,
} from "@/predicates";

/** ----------------------------------------------------------
 * * ***Normalizes whitespace in a string by reducing multiple spaces
 * to a single space, optionally trims, or only trims based on options.***
 * ----------------------------------------------------------
 *
 * - ✅ Collapses all consecutive whitespace (spaces, tabs, newlines) into a single space.
 * - ✅ Can trim leading/trailing spaces (default behavior), or preserve them with `withTrim: false`.
 * - ✅ Can skip normalization entirely and only trim using `trimOnly: true`.
 * - ✅ Returns an empty string if input is `null` or `undefined`.
 *
 * @param {string} [value] - The input string to be processed. If `null` or `undefined`, returns an empty string.
 * @param {object} [options] - Configuration options.
 * @param {boolean} [options.trimOnly=false] - If `true`, skips normalization and only trims the string.
 * @param {boolean} [options.withTrim=true] - If `false`, preserves leading/trailing whitespace.
 *
 * @returns {string} The processed string.
 *
 * @example
 * normalizeSpaces("   Hello    World\tthis   is\n\nok ");
 * // "Hello World this is ok"
 *
 * normalizeSpaces("   Hello    World\tthis   is\n\nok ", { trimOnly: true });
 * // "Hello    World	this   is\n\nok"
 *
 * normalizeSpaces("   Hello    World   ", { withTrim: false });
 * // " Hello World "
 *
 * normalizeSpaces(null);
 * // ""
 */
export const normalizeSpaces = (
  value?: string | null,
  options: {
    /**
     * If `true`, skips normalization and only trims whitespace from start & end.
     * @default false */
    trimOnly?: boolean;
    /**
     * If `false`, skips trimming value.
     * @default true */
    withTrim?: boolean;
  } = {
    withTrim: true,
    trimOnly: false,
  }
): string => {
  if (!isNonEmptyString(value)) return "";

  // Ensure options is an object and Defensive options check
  if (!isObject(options)) {
    options = {};
  }

  const { trimOnly = false, withTrim = true } = options;

  // If trimOnly is true, trim the string and return
  if (trimOnly) return value.trim();

  if (withTrim) {
    value = value.trim();
  }

  // Remove all duplicate spaces (including tabs, newlines, etc.)
  return value.replace(/\s+/g, " ");
};

/** ----------------------------------------------------------
 * * ***Normalizes a string by ensuring it is a valid string and trimming whitespace.***
 * ----------------------------------------------------------
 *
 * @description
 * If the input is `undefined`, `null`, or an `empty string` after trimming,
 * it returns an empty string `("")`.
 *
 * @param {string | undefined | null} input - The input string to be normalize. If `null` or `undefined`, returns an empty string.
 * @returns {string} A trimmed string or an empty string if the input is invalid.
 *
 * @example
 * normalizeString("   Hello World   ");
 * // → "Hello World"
 *
 * normalizeString("");
 * // → ""
 *
 * normalizeString(null);
 * // → ""
 *
 * normalizeString(undefined);
 * // → ""
 */
export const normalizeString = (input?: string | null): string => {
  return isNonEmptyString(input) ? input.trim() : "";
};

/** ----------------------------------------------------------
 * * ***Removes all spaces from a string or trims only, based on the options provided.***
 * ----------------------------------------------------------
 *
 * @description
 * - If `trimOnly` is `true`, the string is simply trimmed.
 * - Otherwise, removes **all spaces**, tabs, newlines, etc.
 * - If the input is `null` or `undefined`, returns an empty string `("")`.
 *
 * @param {string | null | undefined} value - The input string to be processed. If `null` or `undefined`, returns an empty string.
 * @param {object} [options] - The options object.
 * @param {boolean} [options.trimOnly=false] - If `true`, only trims the string without removing spaces inside.
 * @returns {string} The processed string.
 *
 * @example
 * removeSpaces("  Hello   World  ");
 * // → "HelloWorld"
 *
 * removeSpaces("  Hello   World  ", { trimOnly: true });
 * // → "Hello   World"
 *
 * removeSpaces(null);
 * // → ""
 */
export const removeSpaces = (
  value?: string | null,
  options: {
    /**
     * @description If true, only trims the string.
     *
     * @default false */
    trimOnly?: boolean;
  } = {
    trimOnly: false,
  }
): string => {
  if (!isNonEmptyString(value)) return "";

  // Ensure options is an object and Defensive options check
  if (!isObject(options)) {
    options = {};
  }

  const { trimOnly = false } = options;

  // If trimOnly is true, trim the string and return
  if (trimOnly) return value.trim();

  // Remove all spaces (including tabs, newlines, etc.)
  return value.replace(/\s+/g, "");
};

/** ----------------------------------------------------------
 * * ***Removes all HTML tags from a given string.***
 * ----------------------------------------------------------
 *
 * This function removes valid HTML tags (including nested and self-closing ones)
 * by replacing them with spaces, then collapses multiple whitespaces into a single space.
 *
 * It handles the following cases:
 * - If the input is not a string (`null`, `undefined`, or any non-string), it is returned as undefined.
 * - If the input is an empty or whitespace-only string, it returns an empty string (`""`).
 * - Otherwise, it returns the cleaned string with tags removed and normalized whitespace.
 *
 * @template T - Input string type (string | null | undefined).
 * @param {T} [input] - A string potentially containing HTML tags.
 * @returns {T extends string ? string : T} - Cleaned string if input is string, or original input otherwise.
 *
 * @example
 * stripHtmlTags("<p>Hello</p>"); // "Hello"
 * stripHtmlTags("<div><b>Bold</b> text</div>"); // "Bold text"
 * stripHtmlTags("Line<br/>Break"); // "Line Break"
 * stripHtmlTags("2 < 5 and 5 > 2"); // "2 < 5 and 5 > 2"
 * stripHtmlTags(""); // ""
 * stripHtmlTags("   "); // ""
 * stripHtmlTags(null); // undefined
 * stripHtmlTags(undefined); // undefined
 */
export const stripHtmlTags = <T extends string | null | undefined = undefined>(
  input?: T
): T extends string ? string : undefined => {
  if (!isString(input)) {
    return undefined as T extends string ? string : undefined;
  }

  if (isEmptyString(input)) {
    return "" as T extends string ? string : undefined;
  }

  // return input.replace(/<[^>]*>/g, "") as T extends string ? string : undefined;
  const stripped = input.replace(/<\/?[a-zA-Z][^<>]*\/?>/g, " ").trim();

  const cleaned = stripped.replace(/\s+/g, " ").trim();

  return cleaned as T extends string ? string : undefined;
};
