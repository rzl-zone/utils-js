import {
  isBoolean,
  isObject,
  isString,
  isUndefined,
  normalizePathname,
} from "@/index";
import { getBeApiUrl } from "@/next";

/** ---------------------------------
 * * ***Constructs a backend API URL by appending a given pathname to the base API URL.***
 * ---------------------------------
 * This function builds on top of `getBeApiUrl()`, which determines the base API URL from:
 * - `NEXT_PUBLIC_BACKEND_API_URL` environment variable (or defaults to `"http://localhost:8000"`).
 * - Automatically appends `NEXT_PUBLIC_PORT_BE` if the base URL does not already include a port.
 *
 * Features of this function:
 * - Allows customizing the API path with an optional `prefix` (defaults to `"/api"`).
 * - Can include or exclude the origin (protocol + host) via `withOrigin`.
 * - Normalizes paths to avoid duplicate slashes.
 *
 * * ⚠️ ***Notes: This Function only support when using `NextJS`***
 *
 * @param {string} pathname - The API endpoint path (e.g., `/users` or `/v1/posts`).
 * @param {Object} options - Configuration options.
 * @param {string} [options.prefix="/api"] - The prefix for the API path (default is `"/api"`).
 * @param {boolean} [options.withOrigin=true] - Whether to include the full base URL or return only the API path.
 * @returns {string} The formatted API URL.
 *
 * @throws {TypeError} If `withOrigin` is not a boolean.
 * @throws {TypeError} If `prefix` and `pathname` is not a string.
 * @throws {Error} If constructing the API URL fails due to an invalid base URL.
 *
 * @example
 * createBeApiUrl("/users")
 * // -> "http://localhost:8000/api/users"
 *
 * createBeApiUrl("/users", { withOrigin: false })
 * // -> "/api/users"
 */
export const createBeApiUrl = (
  /** * The pathname api url, e.g:`"http://localhost.com/your-target-prefix-entri-point-api-is-here/your-target-pathname-is-here"`.
   *
   * @default "" */
  pathname: string = "",
  options?: {
    /** * The prefix pathname api url, e.g:`"http://localhost.com/your-target-prefix-entri-point-api-is-here"`.
     *
     * @default "/api" */
    prefix?: string;
    /** * Option to getting `prefix` and `pathname` of api url only `(removing origin base api url)`.
     *
     * @default true */
    withOrigin?: boolean;
  }
): string => {
  try {
    // ✅ Type checks
    if (!isString(pathname)) {
      throw new TypeError(
        `Invalid type for 'pathname'. Expected 'string', received: ${typeof pathname}`
      );
    }

    if (!isObject(options)) {
      options = {};
    }

    let {
      prefix = "/api",
      // eslint-disable-next-line prefer-const
      withOrigin = true,
    } = options;

    if (!isUndefined(prefix) && !isString(prefix)) {
      throw new TypeError(
        `Invalid type for 'prefix'. Expected 'string', received: ${typeof prefix}`
      );
    }

    if (!isBoolean(withOrigin)) {
      throw new TypeError(
        `Invalid type for 'withOrigin'. Expected 'boolean', received: ${typeof withOrigin}`
      );
    }

    // Normalize pathname
    pathname = normalizePathname(pathname);

    // Normalize prefix
    prefix = normalizePathname(prefix);

    const normalizedPrefix = prefix.endsWith("/") ? prefix : prefix + "/";

    // Remove duplicate prefix in pathname
    if (
      pathname === prefix ||
      pathname === prefix + "/" ||
      pathname.startsWith(normalizedPrefix)
    ) {
      pathname = pathname.slice(prefix.length);
      pathname = normalizePathname(pathname);
    }

    // Get the base API URL
    const baseApiUrl = getBeApiUrl({ suffix: prefix });

    function joinPath(a: string, b: string) {
      return `${a.replace(/\/+$/, "")}/${b.replace(/^\/+/, "")}`;
    }

    const fullPath = withOrigin
      ? joinPath(baseApiUrl, pathname)
      : joinPath(new URL(baseApiUrl).pathname, pathname);

    return fullPath.replace(/\/+$/, "");
  } catch (error) {
    throw new Error(
      "Failed to generate backend API URL in `createBeApiUrl()`, Error:" + error
    );
  }
};
