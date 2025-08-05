import {
  isBoolean,
  isEmptyString,
  isNonEmptyString,
  isNumber,
  isString,
} from "@/index";

/** ----------------------------------------------------------
 * * ***Truncates a string to a specified length and optionally appends an ending.***
 * * ***Also provides an option to trim the string before truncation.***
 * * ***If truncation occurs, trailing spaces before the ending are removed.***
 * * ***The `ending` parameter is always trimmed first; if it becomes empty, it defaults to `"..."`.***
 * ----------------------------------------------------------
 *
 * @param {string|null|undefined} text - The input string to truncate.
 *        If `null`, `undefined`, or empty after trim, returns `""`.
 * @param {number} [length=10] - The maximum length of the truncated string **(default: `10`)**.
 * @param {string} [ending="..."] - The string to append if truncation occurs **(default: `"..."`)**.
 *                                   This value is always passed through `ending.trim()`.
 *                                   If `ending.trim().length < 1`, it automatically becomes `"..."`.
 * @param {boolean} [trim=true] - Whether to trim the string before truncation **(default: `true`)**.
 *
 * @returns {string} - The truncated string with optional trimming and ending.
 *                     If text is `null`, `undefined`, or `length < 1`, returns `""`.
 *                     If truncation happens, trailing spaces before the `ending` are automatically removed.
 *
 * @throws {TypeError} - If `length` is not a number, `ending` is not a string, or `trim` is not a boolean.
 *
 * @example
 * truncateString("hello world", 5); // "hello..."
 * truncateString("hello world", 5, "---"); // "hello---"
 * truncateString("hello world", 5, "   "); // "hello..." (because ending.trim() -> "" -> default to "...")
 * truncateString("hello world", 5, "   !!!   "); // "hello!!!" (ending is trimmed to "!!!")
 * truncateString("   long data string   ", 8, "...", true); // "long dat..."
 * truncateString("   long data string   ", 8, "...", false); // "   long ..."
 * truncateString(" text with spaces ", 10, "...", false); // " text with..."
 * truncateString("abc def", 7); // "abc def"
 * truncateString(null, 5); // ""
 * truncateString("short", 10); // "short"
 */
export const truncateString = (
  text?: string | null,
  length: number = 10,
  ending: string = "...",
  trim: boolean = true
): string => {
  if (!isNonEmptyString(text)) return "";
  // if (!text || typeof text !== "string" || text.trim().length < 1) return "";

  if (length < 1) return "";

  if (!(isNumber(length) && isString(ending) && isBoolean(trim))) {
    throw new TypeError(
      "Expected 'ending' to be a 'string' type, 'length' to be a 'number' type, 'trim' to be a 'boolean' type"
    );
  }

  if (isEmptyString(ending)) {
    ending = "...";
  } else {
    ending = ending.trim();
  }

  const original = trim ? text.trim() : text;
  const originalTrimmedLength = original.length;

  if (originalTrimmedLength <= length) return original;

  const sliced = original.slice(0, length);
  const cleanSliced = trim ? sliced : sliced.trimEnd();

  return cleanSliced + ending;
};
