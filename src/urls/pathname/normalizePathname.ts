import { isError } from "@/predicates/is/isError";
import { getPreciseType } from "@/predicates/type/getPreciseType";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";

import { removeSpaces } from "@/strings/sanitizations/removeSpaces";
import { safeStableStringify } from "@/conversions/stringify/safeStableStringify";

import { NormalizePathnameError } from "../_private/NormalizePathnameError";

/** --------------------------------------------------------
 * * ***Utility: `normalizePathname`.***
 * --------------------------------------------------------
 * **This function processes and normalizes a given pathname.**
 * - **Behavior:**
 *    - If `pathname` is `null`, `undefined`, empty, or only whitespace, the `defaultPath` will be returned instead.
 *    - If `pathname` is a full URL (starting with `http://` or `https://`), it extracts and returns the pathname along
 *      with any search parameters and hash.
 *      - Example: `"https://site.com/foo/bar?x=1#sec"` becomes `"/foo/bar?x=1#sec"`.
 *    - All spaces inside the pathname are removed.
 *    - Multiple consecutive slashes (like `"//"` or `"///"`) are collapsed into a single slash `"/"`.
 *    - Ensures the returned string always starts with exactly one `/`.
 * @param {string | null | undefined} pathname - The pathname to normalize.
 * @param {string} [defaultPath="/"] - A fallback value returned if `pathname` is empty or invalid, must be a string and non-empty string, default `"/"`.
 * @returns {string} A properly normalized pathname starting with a single `/`,
 * or the `defaultPath` if the input is invalid or empty.
 * @throws {TypeError} If `defaultPath` is not a string or empty-string.
 * @throws {NormalizePathnameError} If an unexpected error occurs during normalization (e.g., URL parsing failure).
 * @example
 * normalizePathname("   /foo//bar  ");
 * // ➔ "/foo/bar"
 * normalizePathname("https://example.com//path///to/resource?x=1#hash");
 * // ➔ "/path/to/resource?x=1#hash"
 * normalizePathname("   ");
 * // ➔ "/"
 * normalizePathname(null, "/home");
 * // ➔ "/home"
 * normalizePathname("/double//slashes");
 * // ➔ "/double/slashes"
 * normalizePathname(" nested / path / 🚀 ");
 * // ➔ "/nested/path/🚀"
 */
export const normalizePathname = (
  pathname: string | null | undefined,
  defaultPath: string = "/"
): string => {
  // Validate defaultPath
  if (!isNonEmptyString(defaultPath)) {
    throw new TypeError(
      `Second parameter (\`defaultPath\`) must be of type \`string\` and not empty-string, but received: \`${getPreciseType(
        defaultPath
      )}\`, with value: \`${safeStableStringify(defaultPath)}\`.`
    );
  }

  // If the pathname is invalid (null, undefined, or an empty string), return the default value
  if (!isNonEmptyString(pathname)) return defaultPath;

  try {
    // Trim spaces from the string (only trim leading and trailing spaces)
    pathname = removeSpaces(pathname, { trimOnly: true });
    pathname = pathname.replace(/\s+/g, ""); // remove all space

    // If the pathname is a full URL, extract the pathname, search parameters, and hash
    if (pathname.startsWith("http://") || pathname.startsWith("https://")) {
      const url = new URL(pathname);
      return `${url.pathname}${url.search}${url.hash}`.replace(/^\/+/, "/");
    }

    // Ensure the pathname starts with "/"
    return "/" + pathname.replace(/^\/+/, "").replace(/\/{2,}/g, "/");
  } catch (error) {
    // Handle any errors that occur during processing
    const err = isError(error)
      ? error
      : new Error("Unknown error from function `normalizePathname()`.");

    throw new NormalizePathnameError(
      `Failed to normalize pathname in function \`normalizePathname()\`: ${err.message}`,
      err
    );
  }
};
