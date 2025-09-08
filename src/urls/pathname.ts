import { isNil } from "@/predicates/is/isNil";
import { isNull } from "@/predicates/is/isNull";
import { isArray } from "@/predicates/is/isArray";
import { isError } from "@/predicates/is/isError";
import { isString } from "@/predicates/is/isString";
import { isInteger } from "@/predicates/is/isInteger";
import { isBoolean } from "@/predicates/is/isBoolean";
import { isPlainObject } from "@/predicates/is/isPlainObject";
import { getPreciseType } from "@/predicates/type/getPreciseType";
import { isNonEmptyArray } from "@/predicates/is/isNonEmptyArray";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";

import { removeSpaces } from "@/strings/sanitize";
import { safeStableStringify } from "@/conversions/stringify/safeStableStringify";
import { NormalizePathnameError } from "./private-exceptions/NormalizePathnameError";

type GetPrefixPathnameOptions = {
  /** The number of levels to include in the prefix (default is `1`). For example, with `levels = 2`, the function will return the first two parts of the URL.
   *
   * @default 1
   */
  levels?: number;
  /** Whether to remove duplicates from the result if multiple URLs are passed (default is `true`).
   *
   * @default true
   */
  removeDuplicates?: boolean;
};

/** --------------------------------------------------------
 * * ***Utility: `getPrefixPathname`.***
 * --------------------------------------------------------
 * **Get Prefix from URL with Optional Base or Auto-detection (Supports String or Array of URLs).**
 * - **This function extracts the prefix from one or more URLs. It can either:**
 *    - Use a provided `base` string or an array of strings to check and return the matching prefix.
 *    - Automatically detect the prefix if no `base` is provided by analyzing the first part of the URL.
 * - **The function is flexible and can handle both scenarios:**
 *    1. **When the base is provided as a single string or an array of strings**:
 *        - The function will check if the URL starts with one of the provided base(s) and return the matching base.
 *    2. **When the base is not provided**:
 *        - The function will automatically detect the prefix by splitting the URL or using a regex.
 * - **Important Notes**:
 *    - If a base (or an array of bases) is provided, the URL must start with one of the given base(s).
 *    - If no base is provided, the function will attempt to detect the prefix automatically.
 *    - The `url` parameter can be either a string or an array of strings.
 *    - Supports deduplication of results (enabled by default).
 *    - Automatically returns a single string if only one unique result exists after processing.
 * @param {string|string[]} url The full URL(s) from which the prefix should be extracted.
 *    - Can be a `string` or an `array of strings`.
 * @param {string|string[]|null} [base=null] The base URL(s) (e.g., `"/settings"`).
 *    - It can be a `string`, an `array of strings`, or `null`.
 *    - If `provided`, it will be used to check the URL(s).
 *    - If `not provided`, the prefix will be auto-detected.
 * @param {GetPrefixPathnameOptions} [options] Additional options object:
 *    - `levels` (default `1`): The number of segments to include when auto-detecting the prefix (e.g. `/foo/bar` for `levels: 2`).
 *    - `removeDuplicates` (default `true`): Whether to remove duplicate prefixes from the final array result.
 * @returns {string|string[]|null} Returns one of:
 *    - A single string if only one unique prefix/base is found.
 *    - An array of strings if multiple different prefixes/bases are found.
 *    - `null` if no matching base is found when using `base`.
 * @throws {TypeError} Throws if:
 *    - `url` is `not a string` or `not an array of strings`.
 *    - `base` is `not a string`, `array of strings`, or `null`.
 *    - `options` is `not an object`.
 *    - `levels` is `not a number`.
 *    - `removeDuplicates` is `not a boolean`.
 * @example
 * - #### ✅ **Correct Usage (With an Array of URLs and Base):**
 * ```ts
 *    const routes = [
 *      "/settings/profile",
 *      "/settings/password",
 *      "/settings/other-path",
 *      "/other-path/xyz",
 *    ];
 *
 *    // With base provided as a string
 *    routes.forEach(route => {
 *      console.log(getPrefixPathname(route, '/settings'));
 *      // ➔ "/settings"
 *    });
 *
 *    // With base provided as an array
 *    routes.forEach(route => {
 *      console.log(getPrefixPathname(route, ['/settings', '/admin']));
 *      // ➔ "/settings" or "/admin" depending on the current URL.
 *    });
 * ```
 * - #### ✅ **Correct Usage (With Single URL and Single Base):**
 * ```ts
 *    const result = getPrefixPathname("/settings/profile", "/settings");
 *    console.log(result); // ➔ "/settings"
 * ```
 * - #### ✅ **Correct Usage (With Multiple URLs and Single Base):**
 * ```ts
 *    const result = getPrefixPathname(
 *      ["/settings/profile", "/settings/password"],
 *      "/settings"
 *    );
 *    console.log(result); // ➔ "/settings"
 *
 *    const result2 = getPrefixPathname(
 *      ["/settings/profile", "/other/password"],
 *      "/other"
 *    );
 *    console.log(result2); // ➔ "/other"
 * ```
 * - #### ✅ **Correct Usage (With Multiple URLs and Multiple Bases)**
 * ```ts
 *    const result = getPrefixPathname(
 *      ["/settings/profile", "/admin/password"],
 *      ["/settings", "/admin"]
 *    );
 *    console.log(result); // ➔ ["/settings", "/admin"]
 * ```
 * - #### ✅ **Auto-detection of Prefix**
 * ```ts
 *    const result = getPrefixPathname("/settings/profile");
 *    console.log(result); // ➔ "/settings"
 *
 *    const result2 = getPrefixPathname(
 *      "/settings/profile/info",
 *      null,
 *      { levels: 2 }
 *    );
 *    console.log(result2); // ➔ "/settings/profile"
 * ```
 * - #### ✅ **Multiple URLs with Auto-detection**
 * ```ts
 *    const result = getPrefixPathname(["/admin/profile", "/settings/password"]);
 *    console.log(result); // ➔ ["/admin", "/settings"]
 * ```
 * - #### ✅ **Handling Duplicates**
 * ```ts
 *    const result = getPrefixPathname(
 *      ["/settings/profile", "/settings/password"],
 *      "/settings"
 *    );
 *    console.log(result); // ➔ "/settings" (deduped to single string)
 *
 *    const result2 = getPrefixPathname(
 *      ["/settings/profile", "/settings/profile"],
 *      "/settings",
 *      { removeDuplicates: false }
 *    );
 *    console.log(result2); // ➔ ["/settings", "/settings"]
 * ```
 * - #### ❌ **Incorrect Usage (URL Does Not Match Base)**
 * ```ts
 *    const result = getPrefixPathname("/other-path/profile", "/settings");
 *    console.log(result); // ➔ null
 * ```
 */
export const getPrefixPathname = (
  url: string | string[],
  base: string | string[] | null = null,
  options: GetPrefixPathnameOptions = {}
): string | string[] | null => {
  const errors: string[] = [];

  if (!isString(url) && !isArray(url)) {
    errors.push(
      `First parameter (\`url\`) must be of type \`string\` or \`array-string\`, but received: \`${getPreciseType(
        url
      )}\`.`
    );
  }
  if (!isString(base) && !isArray(base) && !isNull(base)) {
    errors.push(
      `Second parameter (\`base\`) must be of type \`string\`, \`array-string\` or \`null\`, but received: \`${getPreciseType(
        base
      )}\`.`
    );
  }
  if (!isPlainObject(options)) {
    errors.push(
      `Second parameter (\`options\`) must be of type \`plain-object\`, but received: \`${getPreciseType(
        options
      )}\`.`
    );
  }

  const { levels = 1, removeDuplicates = true } = options;

  if (!isInteger(levels) || (isInteger(levels) && levels < 0)) {
    errors.push(
      `Parameter \`levels\` property of the \`options\` (second parameter) must be of type \`integer-number\` and minimum is \`0\`, but received: \`${getPreciseType(
        levels
      )}\`, with value: \`${safeStableStringify(levels)}\`.`
    );
  }
  if (!isBoolean(removeDuplicates)) {
    errors.push(
      `Parameter \`removeDuplicates\` property of the \`options\` (second parameter) must be of type \`boolean\`, but received: \`${getPreciseType(
        removeDuplicates
      )}\`.`
    );
  }
  if (isNonEmptyArray(errors)) {
    throw new TypeError(
      `Invalid parameter(s) in \`getPrefixPathname\` function:\n- ${errors.join("\n- ")}`
    );
  }

  // Helper function to process a single URL
  function getLevel(singleUrl: string) {
    // If no base is provided, detect the base automatically
    const parts = normalizePathname(singleUrl).split("/").filter(Boolean); // Split URL into parts

    // Return the first `levels` parts as the prefix
    return `/${parts.slice(0, levels).join("/")}`;
  }

  // Helper function to process a single URL
  function processUrl(singleUrl: string): string | null {
    // If a base is provided, check if URL starts with one of the bases
    if (base) {
      singleUrl = normalizePathname(singleUrl);

      if (isArray(base)) {
        // Check if the URL starts with any of the base values in the array
        for (const b of base) {
          if (singleUrl.startsWith(normalizePathname(b))) {
            // return normalizePathname(b); // Return the matching base if URL starts with it
            return getLevel(singleUrl);
          }
        }
      } else if (
        isNonEmptyString(base) &&
        singleUrl.startsWith(normalizePathname(base))
      ) {
        // If base is a single string, check if URL starts with it
        // return normalizePathname(base); // Return the base if URL starts with it
        return getLevel(singleUrl);
      }
      return null; // Return null if the URL does not match any base
    }

    return getLevel(singleUrl);
  }

  // If url is an array, process each URL and return an array of results
  if (isArray(url)) {
    const result = url.map(processUrl).filter((r): r is string => !isNull(r));

    // Remove duplicates if required
    const uniqueResult = removeDuplicates ? [...new Set(result)] : result;

    // If all results are the same, return just the first one
    if (uniqueResult.length === 1) {
      return uniqueResult[0];
    }

    return uniqueResult;
  }

  // If url is a single string, process it and return the result
  return processUrl(url);
};

/** --------------------------------------------------------
 * * ***Utility: `getFirstPrefixPathname`.***
 * --------------------------------------------------------
 * **Extract First Valid Prefix from Path Array or String.**
 * - **Main Purpose:**
 *    - This function helps extract the first valid URL prefix from various possible inputs.
 *    - It is especially useful in routing systems, middleware, or frontend apps that need to
 *      decide layout, active navigation, or permissions based on the first segment (or prefix) of a pathname.
 * - **Typical uses include:**
 *    - Determining which layout to render (e.g., `/admin` vs `/dashboard` vs `/`).
 *    - Highlighting the active menu item in a sidebar based on the current URL.
 *    - Enforcing route guards or access controls depending on the URL prefix.
 *    - Parsing multi-level route prefixes and selecting the most relevant one.
 * - **Behavior:**
 *    - It works as follows:
 *        - If `result` is an array of strings, it normalizes each element and returns
 *          the first non-root path (i.e., not just `"/"`).
 *        - If all items normalize to `"/"`,
 *          it returns the `defaultValue` (normalized).
 *        - If `result` is a single string, it normalizes it and returns it if valid,
 *          otherwise falls back to the normalized `defaultValue`.
 *        - If `result` is `null` or `undefined`, it returns the normalized `defaultValue`.
 * - **Validation & Errors:**
 *    - Throws a `TypeError` if:
 *      - `defaultValue` is not a string or empty-string.
 *      - `result` is an array that contains non-string elements.
 *      - `result` is a value that is neither `string`, `string[]`, nor `null`.
 * @example
 * 1. #### For React (*Determining layout*):
 * ```ts
 *   const prefix = getFirstPrefixPathname(
 *      getPrefixPathname(
 *        "/admin/settings",
 *        ["/admin", "/dashboard"]
 *      )
 *   );
 *
 *   if (prefix === "/admin") {
 *     renderAdminLayout();
 *   }
 * ```
 *
 * 2. #### Setting active menu state:
 * ```ts
 *   const activeSection = getFirstPrefixPathname(["", "/dashboard", "/profile"]);
 *   // ➔ "/dashboard"
 * ```
 *
 * 3. #### Providing graceful fallback:
 * ```ts
 *   const section = getFirstPrefixPathname([], "/home");
 *   // ➔ "/home"
 * ```
 * 4. #### ✅ Using with an Array of Pathnames:
 * ```ts
 *   const result = getPrefixPathname(["   ", "/dashboard", "/settings"]);
 *   console.log(getFirstPrefixPathname(result));
 *   // ➔ "/dashboard"
 * ```
 *
 * 5. #### ✅ Using with Single String:
 * ```ts
 *   console.log(getFirstPrefixPathname("/profile/settings"));
 *   // ➔ "/profile/settings"
 *   console.log(getFirstPrefixPathname("   "));
 *   // ➔ "/"
 * ```
 *
 * 6. #### ✅ Fallback to Custom Default:
 * ```ts
 *   console.log(getFirstPrefixPathname(["   ", ""], "/home"));
 *   // ➔ "/home"
 *   console.log(getFirstPrefixPathname(null, "/dashboard"));
 *   // ➔ "/dashboard"
 * ```
 *
 * 7. #### ✅ Throws on Invalid Input:
 * ```ts
 *   getFirstPrefixPathname([1, 2] as any); // ➔ ❌ throws TypeError
 *   getFirstPrefixPathname({} as any);     // ➔ ❌ throws TypeError
 *   getFirstPrefixPathname(null, "   ");   // ➔ ❌ throws TypeError
 * ```
 * @param {string | string[] | null | undefined} result
 *    The pathname(s) to process, can be:
 *    - A string path (e.g. `"/profile"`),
 *    - An array of string paths (e.g. `["   ", "/dashboard"]`),
 *    - Or `null`.
 * @param {string} [defaultValue="/"]
 *    A custom default path to use if `result` is null or no valid prefix is found.
 *      - Must be a string and non-empty string.
 *      - Defaults to `"/"`.
 * @returns {string}
 *    The first valid normalized pathname, or the normalized default.
 * @throws {TypeError}
 *    If `result` is not a valid type, or `defaultValue` is not a string or empty-string.
 */
export const getFirstPrefixPathname = (
  result: string | string[] | null | undefined,
  defaultValue: string = "/"
): string => {
  if (!isNonEmptyString(defaultValue)) {
    throw new TypeError(
      `Second parameter (\`defaultValue\`) must be of type \`string\` and not an \`empty-string\`, but received: \`${getPreciseType(
        defaultValue
      )}\`, with value: \`${safeStableStringify(defaultValue)}\`.`
    );
  }

  if (isArray(result)) {
    if (!result.every((item) => isString(item))) {
      throw new TypeError(
        `First parameter (\`result\`) must be of type \`string\` or \`array of string\`, but received: \`${getPreciseType(
          result
        )}\`, with value: \`${safeStableStringify(result)}\`.`
      );
    }

    for (const item of result) {
      const normalized = normalizePathname(item);
      if (normalized !== "/") {
        return normalized;
      }
    }
    return normalizePathname(defaultValue);
  }

  if (isString(result)) {
    const normalized = normalizePathname(result);
    return normalized !== "/" ? normalized : normalizePathname(defaultValue);
  }

  if (!isNil(result)) {
    throw new TypeError(
      `First parameter (\`result\`) must be of type \`string\`, \`array-string\`, \`null\` or \`undefined\`, but received: \`${getPreciseType(
        result
      )}\`.`
    );
  }

  return normalizePathname(defaultValue);
};

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
 * @param {string} [defaultPath="/"] - A fallback value returned if `pathname` is empty or invalid.
 *    - Must be a string and non-empty string, default `"/"`.
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
