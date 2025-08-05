import {
  isArray,
  isBoolean,
  isEmptyString,
  isNull,
  isObject,
  isString,
} from "./";

/** ----------------------------------------------------------
 * * ***Checks if the given `text` contains at least one of the specified `searchWords`.***
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
 * @returns {boolean} - `true` if at least one `searchWord` is found in `text`, otherwise `false`.
 *
 * @example
 * textContainsAny("Hello world", ["hello", "test"]); // true
 * textContainsAny("withAI APP", ["chat", "ai"]); // false
 * textContainsAny("TypeScript is great!", ["script", "java"]); // true
 * textContainsAny("open-source", ["open"], { exactMatch: true }); // false (because options `exactMatch=true`)
 */
export const textContainsAny = <T extends string>(
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
  const { exactMatch = false, flags = "i" } = options || {};

  if (!isBoolean(exactMatch)) {
    throw new TypeError(`props 'exactMath' must be \`boolean\` type!`);
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

  // Create regex pattern: Whole word match (`\bword\b`) if `exactMatch` is true
  // const pattern = exactMatch
  //   ? `\\b(${validSearchWords.join("|")})\\b`
  //   : `(${validSearchWords.join("|")})`;
  // return new RegExp(pattern, flags).test(text);

  const pattern = exactMatch
    ? `(?<!\\S)(${validSearchWords.join("|")})(?!\\S)`
    : `(${validSearchWords.join("|")})`;

  return new RegExp(pattern, flags.includes("u") ? flags : flags + "u").test(
    text
  );
};
