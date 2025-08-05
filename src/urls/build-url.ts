import {
  isArray,
  isEmptyString,
  isEmptyValue,
  isFunction,
  isString,
  isUndefined,
  isURL,
  removeSpaces,
  toStringArrayUnRecursive,
} from "@/index";

/** ---------------------------------
 * * ***Constructs a valid URL with optional query parameters and allows selective removal of duplicate parameters.***
 * ---------------------------------
 *
 *
 * @param {string | URL} baseUrl
 *   The base URL to build upon. Must include protocol (e.g., "https://"),
 *   domain, and may include port and existing query parameters.
 *
 * @param {Iterable<[string, string]>|URLSearchParamsIterator<[string, string]>} [queryParams]
 *   Additional query parameters to append or overwrite on the URL.
 *   Accepts any iterable of key-value pairs (like `new URLSearchParams().entries()`).
 *
 * @param {string[]} [removeParams]
 *   A list of query parameter keys to remove from the final URL,
 *   whether they were in the base URL or provided queryParams.
 *
 * @returns {URL}
 *   A new URL object representing the constructed URL with merged
 *   and cleaned query parameters.
 *
 * @throws {TypeError}
 *   Throws if `baseUrl` is not a valid non-empty string or URL object,
 *   or if `queryParams` is not iterable, or if `removeParams` is not an array of strings.
 *
 * @example
 * // Basic usage
 * constructURL("https://example.com/path", new URLSearchParams({ a: "1", b: "2" }).entries());
 * // => URL { href: "https://example.com/path?a=1&b=2", ... }
 *
 * @example
 * // Remove parameters from base and added
 * constructURL("https://example.com/path?foo=1&bar=2", new URLSearchParams({ bar: "ignored", baz: "3" }).entries(), ["bar"]);
 * // => URL { href: "https://example.com/path?foo=1&baz=3", ... }
 */
export const constructURL = (
  baseUrl: string | URL,
  queryParams?: URLSearchParamsIterator<[string, string]>,
  removeParams?: string[]
): URL => {
  if (isString(baseUrl)) {
    if (isEmptyString(baseUrl)) {
      throw new TypeError("`baseUrl` cannot be an empty string.");
    }
    baseUrl = removeSpaces(baseUrl, { trimOnly: true });
  } else if (!isURL(baseUrl)) {
    throw new TypeError(
      `Invalid 'baseUrl'. Expected a non-empty string or a URL instance, received: ${typeof baseUrl}`
    );
  }

  // 🔍 Check removeParams
  if (!isUndefined(removeParams)) {
    if (!isArray(removeParams)) {
      throw new TypeError("`removeParams` must be an array of strings.");
    }
    if (!removeParams.every((param) => isString(param))) {
      throw new TypeError("`removeParams` must only contain strings.");
    }
  }

  try {
    // 🔍 Check queryParams
    if (
      !isUndefined(queryParams) &&
      !isFunction(queryParams[Symbol.iterator])
    ) {
      throw new TypeError(
        "`queryParams` must be iterable (like URLSearchParams.entries() or an array of [string, string])"
      );
    }

    const urlInstance = new URL(baseUrl);

    // Add query parameters if provided
    if (!isUndefined(queryParams)) {
      const paramObject = Object.fromEntries(queryParams);

      if (!isEmptyValue(paramObject)) {
        // existing params
        const mergedParams = new URLSearchParams(urlInstance.search);

        // add / overwrite from queryParams
        for (const [key, value] of Object.entries(paramObject)) {
          mergedParams.set(key, value);
        }

        // const urlSearchParams = new URLSearchParams(paramObject);

        // Remove specific query parameters if needed
        if (removeParams?.length) {
          toStringArrayUnRecursive(removeParams)?.map((paramKey) => {
            mergedParams.delete(paramKey);
          });
        }

        urlInstance.search = mergedParams.toString();
      }
    }

    // Remove query parameters directly from URL if needed
    removeParams?.forEach((param) => urlInstance.searchParams.delete(param));

    return urlInstance;
  } catch (error) {
    throw new Error(
      "Failed to construct a valid URL in `constructURL()`, Error:" + error
    );
  }
};
