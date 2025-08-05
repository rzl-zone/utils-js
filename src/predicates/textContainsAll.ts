import {
  isArray,
  isBoolean,
  isEmptyString,
  isNull,
  isObject,
  isString,
} from "./";

/** ----------------------------------------------------------
 * * ***Checks if the given `text` contains all of the specified `searchWords`.***
 * ----------------------------------------------------------
 *
 * - ✅ Uses **regular expressions** for flexible pattern matching.
 * - ✅ **Escapes special characters** to prevent regex injection attacks.
 * - ✅ **Trims input** to avoid false positives with empty spaces.
 * - ✅ **Supports exact word matching** (optional).
 *
 * @param {string} text - The text to search within.
 * @param {string[]} searchWords - An array of words/phrases to match against the text.
 * @param {boolean} [options.exactMatch=false] - If `true`, matches whole words only, defaultValue is `false`.
 * @param {string} [options.flags="i"] - Optional regex flags (default: `"i"` for case-insensitive).
 * @returns {boolean} - `true` if all `searchWords` are found in `text`, otherwise `false`.
 *
 * @example
 * textContainsAll("Hello world, WithAI APP", ["Hello", "world"]); // true
 * textContainsAll("JavaScript and TypeScript", ["Java", "Script"]); // true
 * textContainsAll("Machine Learning", ["AI", "Learning"]); // false
 * textContainsAll("open-source", ["open"], { exactMatch: true }); // false (because options `exactMatch=true`)
 */
export const textContainsAll = <T extends string>(
  text: T,
  searchWords: T[] | string[],
  options?: {
    /** If `true`, matches whole words only, defaultValue is `false`. */
    exactMatch?: boolean;
    /** Optional regex flags (default: `"i"` for case-insensitive). */
    flags?: string;
  }
): boolean => {
  if (!isString(text) || isEmptyString(text) || !isArray(searchWords)) {
    return false;
  }

  if (isNull(options) || !isObject(options)) {
    throw new TypeError(`props 'options' must be \`object\` type!`);
  }

  // fallback to default
  const { exactMatch = false, flags = "i" } = options;

  if (!isBoolean(exactMatch)) {
    throw new TypeError(`props 'exactMatch' must be \`boolean\` type!`);
  }
  if (!isString(flags)) {
    throw new TypeError(`props 'flags' must be \`string\` type!`);
  }

  // Escape special regex characters to prevent unintended behavior
  const escapeRegex = (str: string) =>
    str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Filter out empty search words
  const validSearchWords = searchWords
    .filter((word) => isString(word) && !isEmptyString(word))
    .map(escapeRegex);

  if (validSearchWords.length === 0) return false;

  // Create regex pattern: Whole word match (`\bword\b`) <- is deprecated. if `exactMatch` is true
  return validSearchWords.every((word) => {
    const pattern = exactMatch ? `(?<!\\S)${word}(?!\\S)` : word;
    return new RegExp(pattern, flags.includes("u") ? flags : flags + "u").test(
      text
    );
  });
};
