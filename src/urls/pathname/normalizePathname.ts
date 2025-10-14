import type { Prettify } from "@rzl-zone/ts-types-plus";

import { isNil } from "@/predicates/is/isNil";
import { isNull } from "@/predicates/is/isNull";
import { isError } from "@/predicates/is/isError";
import { isString } from "@/predicates/is/isString";
import { isValidDomain } from "@/predicates/is/isValidDomain";
import { getPreciseType } from "@/predicates/type/getPreciseType";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";
import { assertIsBoolean } from "@/assertions/booleans/assertIsBoolean";
import { assertIsPlainObject } from "@/assertions/objects/assertIsPlainObject";

import { removeSpaces } from "@/strings/sanitizations/removeSpaces";
import { safeStableStringify } from "@/conversions/stringify/safeStableStringify";

import { NormalizePathnameError } from "../_private/NormalizePathnameError";

/** Options when `keepNullable` is false (default).
 *
 * Returns `defaultPath` if `pathname` is empty or invalid.
 */
type UnKeepNullableOptions = {
  /** * ***Fallback value returned if `pathname` is empty-string or invalid.***
   *
   * Must be a **`non-empty string`**, defaultValue: `"/"`.
   *
   * @defaultValue `"/"`.
   */
  defaultPath?: string;

  /** * ***Whether to preserve `null` or `undefined`, defaultValue: `false`.***
   *
   * @defaultValue `false`.
   */
  keepNullable?: false;
};

/** Options when `keepNullable` is true.
 *
 * Preserves `null` or `undefined` instead of returning `defaultPath`.
 */
type KeepNullableOptions = {
  /** * ***Fallback path is ignored when `keepNullable` is true **(except if
   * `pathname` is empty-string or invalid, even this `true`)**,
   * defaultValue: `"/"`.***
   *
   * @defaultValue `"/"`.
   */
  defaultPath?: string;

  /** * ***Preserve `null` or `undefined` as-is if `true` (defaultValue: `false`).***
   *
   * - ***⚠️ Notes:***
   *      - Keep returning `defaultPath` if `pathname` is empty-string, even this `true`.
   *
   * **Must be `true` in this type.**
   */
  keepNullable?: true;
};

type MainNormalizePathnameOptions = {
  /** * ***Preserve trailing slash at the end of the normalized pathname, defaultValue: `false`.***
   *
   * @defaultValue `false`
   */
  keepTrailingSlash?: boolean;
};

/** Options for main `normalizePathname`.
 *
 * Combines `UnKeepNullableOptions` or `KeepNullableOptions` with trailing slash control.
 */
type NormalizePathnameOptions = Prettify<
  MainNormalizePathnameOptions & (UnKeepNullableOptions | KeepNullableOptions)
>;

type NormalizePathnameOptionsKeepNullableTrue = MainNormalizePathnameOptions &
  KeepNullableOptions;
type NormalizePathnameOptionsKeepNullableFalse = MainNormalizePathnameOptions &
  UnKeepNullableOptions;

type ResUnKeepNullable<T> = T extends undefined
  ? string
  : T extends null
  ? string
  : T extends null | undefined
  ? string
  : string;

type ResKeepNullable<T> = T extends string
  ? string
  : T extends undefined
  ? undefined
  : T extends null
  ? null
  : T extends null | undefined
  ? null | undefined
  : string | null | undefined;

/** --------------------------------------------------------
 * * ***Utility: `normalizePathname`.***
 * --------------------------------------------------------
 * - **Description:**
 *    - Normalizes a given pathname string for consistent routing, URL handling, and string hygiene.
 *    - It trims whitespace, collapses redundant slashes, handles full URLs, query strings, hash fragments,
 *    - Unicode characters, emojis, and optionally preserves `null` or `undefined`.
 *    - Trailing slash behavior can be controlled via `keepTrailingSlash`.
 *
 * - **Behavior Details:**
 *    - Trims leading and trailing whitespace.
 *    - Removes all internal spaces.
 *    - Collapses multiple consecutive slashes into a single `/`.
 *    - Prepends a leading slash if missing.
 *    - Preserves trailing slash only if `keepTrailingSlash` is `true`.
 *    - Supports full URLs (`http://` or `https://`) and relative paths only also detect valid domain and
 *      subdomain (with support handle wildcard eg: *.example.com) (with optional with port) eg (localhost, localhost:3000, example.com, sub.domain.com, *.domain.test, etc).
 *    - Preserves query strings (`?key=value`) and hash fragments (`#anchor`) intact.
 *    - Handles emojis and Unicode safely.
 *    - Returns `string`, `null` or `undefined` as-is if `keepNullable` is true.
 *    - Returns `undefined` if pathname is not a string and `keepNullable` is `true`.
 *    - Returns `defaultPath` if pathname is empty-string even when `keepNullable` is true.
 *    - Returns `defaultPath` if pathname is empty/invalid and `keepNullable` is `false`.
 *
 * - **Options (`options`)**:
 *    - `defaultPath` (***`string`***, default: **`"/"`**)
 *       - Fallback path if the input is invalid (**empty-string**, **null**, **undefined**) and
 *          `keepNullable` is **false**, if `keepNullable` is true, used only when pathname is empty-string.
 *    - `keepNullable` (***`boolean`***, default: **`false`**)
 *       - If **true**, preserves `null` or `undefined` as-is instead of returning
 *         `defaultPath` (except if `pathname` is **empty-string**).
 *    - `keepTrailingSlash` (***`boolean`***, default: **`false`**)
 *      - If **true**, preserves a trailing slash at the end of the normalized pathname.
 *
 * @param {string | null | undefined} pathname - ***The pathname to normalize.***
 * @param {NormalizePathnameOptions} [options] - ***Configuration options.***
 *
 * @returns {string | null | undefined} ***Normalized pathname, or original nullable value if `keepNullable` is `true`
 * _(except if `pathname` is empty-string, will keep returning `defaultPath`)_.***
 *
 * @throws {TypeError} If `defaultPath` is invalid when `keepNullable` is false.
 * @throws {NormalizePathnameError} If normalization fails (e.g., invalid URL).
 *
 * @example
 * // Basic normalization
 * normalizePathname("   /foo//bar  ");
 * // ➔ "/foo/bar"
 *
 * // Full URL with query and hash
 * normalizePathname("https://example.com//path///to/resource?x=1#hash");
 * // ➔ "/path/to/resource?x=1#hash"
 *
 * // Empty string returns defaultPath
 * normalizePathname("   ");
 * // ➔ "/"
 *
 * // Return defaultPath if isn't valid pathname and keepNullable is `undefined` or `false`.
 * normalizePathname(null, { defaultPath: "/home" });
 * // ➔ "/home"
 *
 * // Preserve null
 * normalizePathname(null, { keepNullable: true });
 * // ➔ null
 *
 * // Preserve undefined
 * normalizePathname(undefined, { keepNullable: true });
 * // ➔ undefined
 *
 * // Return defaultPath if pathname is empty-string even with keepNullable
 * normalizePathname("  ", { keepNullable: true, defaultPath:"/home" });
 * // ➔ "/home"
 *
 * // Return undefined if pathname is not a valid-string.
 * normalizePathname(true, { keepNullable: true, defaultPath:"/home" });
 * // ➔ undefined
 *
 * // Collapse multiple slashes
 * normalizePathname("/double//slashes");
 * // ➔ "/double/slashes"
 *
 * // Handles emoji and Unicode
 * normalizePathname(" nested / path / 🚀 ");
 * // ➔ "/nested/path/🚀"
 *
 * // Query and hash preserved
 * normalizePathname("/dashboard///stats?view=all#top");
 * // ➔ "/dashboard/stats?view=all#top"
 *
 * // Leading/trailing slashes normalized
 * normalizePathname("///api//v1///user/");
 * // ➔ "/api/v1/user"
 *
 * // Keep trailing slash if option enabled
 * normalizePathname("///api//v1///user//", { keepTrailingSlash: true });
 * // ➔ "/api/v1/user/"
 *
 * // Relative-like paths handled safely
 * normalizePathname("path/to/page");
 * // ➔ "/path/to/page"
 *
 * // Query-only path
 * normalizePathname("?page=2");
 * // ➔ "/?page=2"
 *
 * // Hash-only path
 * normalizePathname("#section3");
 * // ➔ "/#section3"
 *
 * // URL parsing failure triggers custom error
 * try {
 *    normalizePathname("http://");
 * } catch (e) {
 *    // ➔ console.log(e);
 * }
 *
 * // Internal encoded spaces preserved
 * normalizePathname("/search/%20item%20");
 * // ➔ "/search/%20item%20"
 *
 * // Edge case: relative URL-like input
 * normalizePathname("localhost/path");
 * // ➔ "/path"
 * normalizePathname("localhost:3000/path");
 * // ➔ "/path"
 * normalizePathname("example.com/path");
 * // ➔ "/path"
 * normalizePathname("sub.domain.com/path");
 * // ➔ "/path"
 * normalizePathname("*.domain.com/path");
 * // ➔ "/path"
 *
 * // Deeply nested messy path
 * normalizePathname("   /🔥//deep//path///🚀  ");
 * // ➔ "/🔥/deep/path/🚀"
 *
 * // Edge case: root slash
 * normalizePathname("/");
 * // ➔ "/"
 *
 * // Edge case: multiple spaces only
 * normalizePathname("    ");
 * // ➔ "/"
 */
export function normalizePathname<T>(
  pathname: T,
  options?: NormalizePathnameOptionsKeepNullableFalse
): ResUnKeepNullable<T>;

export function normalizePathname<T>(
  pathname: T,
  options?: NormalizePathnameOptionsKeepNullableTrue
): ResKeepNullable<T>;

export function normalizePathname(
  pathname: unknown,
  options: NormalizePathnameOptions = {
    defaultPath: "/",
    keepNullable: false
  }
): string | null | undefined {
  assertIsPlainObject(options, {
    message({ currentType, validType }) {
      return `Second parameter (\`options\`) must be of type \`${validType}\`, but received: \`${currentType}\`.`;
    }
  });

  const { defaultPath = "/", keepNullable = false, keepTrailingSlash = false } = options;

  // Validate defaultPath
  if (!isNonEmptyString(defaultPath)) {
    throw new TypeError(
      `Parameter \`defaultPath\` property of the \`options\` (second parameter) must be of type \`string\` and not empty-string, but received: \`${getPreciseType(
        defaultPath
      )}\`, with value: \`${safeStableStringify(defaultPath)}\`.`
    );
  }

  assertIsBoolean(keepTrailingSlash, {
    message({ currentType, validType }) {
      return `Parameter \`keepTrailingSlash\` property of the \`options\` (second parameter)  must be of type \`${validType}\`, but received: \`${currentType}\`.`;
    }
  });

  try {
    if (keepNullable && (isNil(pathname) || !isString(pathname))) {
      if (isNull(pathname)) return null;
      return undefined;
    }

    // If the pathname is invalid (null, undefined, or an empty string), return the default value, only if `keepNullable` is false
    let currentPathName: string = isNonEmptyString(pathname) ? pathname : defaultPath;

    // Trim spaces from the string (only trim leading and trailing spaces)
    currentPathName = removeSpaces(currentPathName, { trimOnly: true }).replace(
      /\s+/g,
      ""
    ); // remove all space

    currentPathName = stripLeadingDomain(currentPathName);

    let _pathName: string = currentPathName;
    let search = "";
    let hash = "";

    // relative path: extract search/hash manually
    const searchIndex = currentPathName.indexOf("?");
    const hashIndex = currentPathName.indexOf("#");

    if (searchIndex !== -1) {
      search = currentPathName.slice(
        searchIndex,
        hashIndex !== -1 ? hashIndex : undefined
      );
    }
    if (hashIndex !== -1) {
      hash = currentPathName.slice(hashIndex);
    }

    const endIndex = Math.min(
      searchIndex !== -1 ? searchIndex : currentPathName.length,
      hashIndex !== -1 ? hashIndex : currentPathName.length
    );
    _pathName = currentPathName.slice(0, endIndex);

    // Normalize slashes
    _pathName = "/" + _pathName.replace(/^\/+/, "").replace(/\/{2,}/g, "/");

    // Trailing slash
    // if (keepTrailingSlash && _pathName !== "/") {
    // _pathName += "/"
    // } else
    if (!keepTrailingSlash && _pathName !== "/") {
      _pathName = _pathName.replace(/\/+$/, "");
    }

    // Decode Unicode safely
    _pathName = decodeUnicodeSequences(_pathName);
    search = decodeUnicodeSequences(search);
    hash = decodeUnicodeSequences(hash);

    return _pathName + search + hash;
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
}

function decodeUnicodeSequences(str: string): string {
  return str.replace(/(?:%(?:[0-9A-F]{2})){2,}/gi, (match) => {
    try {
      const decoded = decodeURIComponent(match);
      // eslint-disable-next-line no-control-regex
      if (/^[\u0000-\u007F]+$/.test(decoded)) return match;
      // eslint-enable-next-line no-control-regex
      return decoded;
    } catch {
      return match;
    }
  });
}

function stripLeadingDomain(path: string) {
  let currentPath = path;

  // If full URL (has protocol), use URL parsing
  if (/^https?:\/\//i.test(currentPath)) {
    // Full URL with protocol
    // if (/^(https?:\/\/)/i.test(currentPathName)) {
    //   const url = new URL(currentPathName, "http://localhost");
    //   _pathName = url.pathname;
    //   search = url.search;
    //   hash = url.hash;
    // }

    try {
      const url = new URL(currentPath);
      // Return pathname + search + hash
      currentPath =
        "/" +
        url.pathname.replace(/^\/+/, "").replace(/\/{2,}/g, "/") +
        url.search +
        url.hash;
    } catch {
      // fallback
    }
  }

  // // Normalize slashes
  // currentPath.replace(/\/{2,}/g, "/");

  // remove leading slash for check domain-like
  // let leadingSlash = "";
  if (currentPath.startsWith("/")) {
    // leadingSlash = "/";
    currentPath = currentPath.replace(/\/{2,}/g, "/").slice(1);
  }

  // take only before first slash
  const firstPart = currentPath.split("/")[0]; // ex: example.com, localhost:3000
  const domainPart = firstPart.split(":")[0]; // remove port

  if (
    isValidDomain(domainPart, {
      subdomain: true,
      allowUnicode: true,
      wildcard: true,
      topLevel: false
    }) ||
    domainPart === "localhost"
  ) {
    currentPath = currentPath.slice(firstPart.length);
  }

  // const domainLikeStrict =
  //   /^(?:https?:\/\/)?(?:[\w.-]+\.[a-z]{2,}|localhost)(:\d+)?(?=\/|$)/i;
  // if (
  //   !/^(https?:\/\/)/i.test(currentPathName) &&
  //   domainLikeStrict.test(currentPathName)
  // ) {
  //   currentPathName = currentPathName.replace(domainLikeStrict, "");
  // }

  // Ensure prepend leading slash
  if (!currentPath.startsWith("/")) currentPath = "/" + currentPath;

  return currentPath;
}
