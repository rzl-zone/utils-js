/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  isEmptyString,
  isNonEmptyArray,
  isObject,
  isString,
  isUndefined,
} from "@/index";

/** Extracts dynamic route parameters from a given route string.
 *
 * This utility type recursively searches for dynamic segments within a route,
 * extracting each parameter and constructing an object where each key represents
 * a dynamic segment and its value is of type `string`.
 *
 * * ⚠️ ***Notes: This Type only support when using `NextJS`***
 *
 * @template T - The route string containing potential dynamic segments.
 *
 * @example
 * ```ts
 * type Params1 = ExtractRouteParams<"/user/[id]">;
 * // Result: { id: string }
 *
 * type Params2 = ExtractRouteParams<"/post/[slug]/comment/[commentId]">;
 * // Result: { slug: string; commentId: string }
 *
 * type Params3 = ExtractRouteParams<"/dashboard">;
 * // Result: {} (no dynamic parameters)
 * ```
 */
export type ExtractRouteParams<T extends string> =
  T extends `${infer _Start}[${infer Param}]${infer Rest}`
    ? { [K in Param]: string } & ExtractRouteParams<Rest>
    : Record<any, any>; // Ensures an empty object if no dynamic segments are found.

/** Determines whether a given route contains dynamic segments.
 *
 * This type checks if the route includes at least one `[param]` pattern.
 * If it does, the result is `true`, otherwise `false`.
 *
 * * ⚠️ ***Notes: This Type only support when using `NextJS`***
 *
 * @template T - The route string to be evaluated.
 *
 * @example
 * ```ts
 * type HasParams1 = HasDynamicSegments<"/user/[id]">;
 * // Result: true
 *
 * type HasParams2 = HasDynamicSegments<"/settings/profile">;
 * // Result: false
 *
 * type HasParams3 = HasDynamicSegments<"/blog/[category]/[slug]">;
 * // Result: true
 * ```
 */
export type HasDynamicSegments<T extends string> =
  T extends `${string}[${string}]${string}` ? true : false;

/** ---------------------------------
 * * ***Generates a URL by replacing dynamic route parameters with provided values.***
 * ---------------------------------
 *
 * * ⚠️ ***Notes: This Function only support when using `NextJS`***
 *
 * @template T - The route string containing dynamic segments in the format `[param]`.
 *
 * @param {T} route - The route string containing dynamic segments.
 * @param {ExtractRouteParams<T>} [params] - An object containing key-value pairs that match the dynamic segments in the route.
 *
 * @returns {string} The formatted URL with all dynamic segments replaced.
 *
 * @throws {Error} If the route contains dynamic segments but no parameters object is provided.
 * @throws {Error} If a required parameter is missing from the `params` object.
 * @throws {Error} If a parameter value is an empty string.
 * @throws {Error} If any parameter contains invalid characters like `?`, `&`, `=`, `#`, `/`, spaces, `'`, `"`, `(`, `)`, `+`, `;`, `%`, `@`, or `:`, which can cause URL issues.
 *
 * @example
 * // Basic usage
 * generateRoute("/user/[id]", { id: "123" });
 * // Returns: "/user/123"
 *
 * @example
 * // No dynamic segments, returns as-is
 * generateRoute("/dashboard");
 * // Returns: "/dashboard"
 *
 * @example
 * // Throws an error due to missing parameters object
 * generateRoute("/profile/[username]");
 * // ❌ Error: 🚨 Missing parameters object for route: "/profile/[username]"
 *
 * @example
 * // Throws an error due to an empty parameter value
 * generateRoute("/post/[category]/[slug]", { category: "tech", slug: "" });
 * // ❌ Error: 🚨 Parameter "slug" cannot be empty in route: "/post/[category]/[slug]"
 *
 * @example
 * // Throws an error due to parameter containing invalid characters
 * generateRoute("/search/[query]", { query: "how to?learn" });
 * // ❌ Error: 🚨 Parameter "query" contains invalid character "?" in route: "/search/[query]"
 *
 * @example
 * // Handles leading/trailing slashes correctly
 * generateRoute("/blog/[category]/[slug]", { category: "/news/", slug: "/latest-update/" });
 * // ❌ Error: 🚨 Parameter "category" and "slug" contains slashes "/" which is not allowed.
 */
export function generateRoute<T extends string>(
  route: T,
  ...params: HasDynamicSegments<T> extends true ? [ExtractRouteParams<T>] : []
): string;
export function generateRoute<T extends string>(
  route: T,
  params?: ExtractRouteParams<T>
): string {
  //todo: Validate the route string
  if (!isString(route) || isEmptyString(route)) {
    throw new TypeError(
      `🚨 'generateRoute' Failed:\n- Invalid 'route' value.\n- Expected a non-empty string, but received ${typeof route}: ${JSON.stringify(
        route
      )}`
    );
  }

  //todo: If no dynamic segments exist, return the route as-is immediately
  if (!route.includes("[")) {
    return route;
  }

  //todo: Validate that params is a plain object
  if (!isObject(params)) {
    throw new Error(
      `🚨 'generateRoute' Failed cause in route "${route}":\n- Missing or invalid parameters object for route: "${route}", expected an object mapping parameters.`
    );
  }

  //todo: Ensure parameters are provided for dynamic routes.
  if (!params) {
    throw new Error(
      `🚨 'generateRoute' Failed cause in route "${route}":\n- Missing parameters object for route: "${route}"`
    );
  }

  //todo: Check for invalid characters that can break the URL format
  const invalidChars = [
    "?",
    "&",
    "#",
    "=",
    "/",
    " ",
    // ".",
    "'",
    '"',
    "(",
    ")",
    "+",
    ";",
    "%",
    "@",
    ":",
  ];

  const errors: string[] = [];

  const requiredKeys = Array.from(route.matchAll(/\[(\w+)\]/g)).map(
    (m) => m[1]
  );

  for (const key of requiredKeys) {
    const rawValue: string | undefined = params[key as keyof typeof params];

    if (isUndefined(rawValue)) {
      errors.push(`- Missing parameter: "${key}".`);
      continue;
    }

    const trimmedValue = rawValue.trim();

    if (!trimmedValue) {
      errors.push(`- Parameter "${key}" cannot be empty.`);
      continue;
    }

    if (trimmedValue.includes("/")) {
      errors.push(
        `- Parameter "${key}" contains slashes "/" which is not allowed.`
      );
    }

    const foundInvalidChars = invalidChars
      .filter((char) => char !== "/") // slash already manually checked
      .filter((char) => trimmedValue.includes(char));

    if (foundInvalidChars.length > 0) {
      errors.push(
        `- Parameter "${key}" contains invalid characters (${
          foundInvalidChars.length > 1
            ? foundInvalidChars.join(",")
            : foundInvalidChars
        }). These characters are not allowed because they could cause issues in URL structure. The following characters are forbidden in route parameters: (${invalidChars.join(
          ", "
        )}).`
      );
    }
  }

  if (isNonEmptyArray(errors)) {
    throw new Error(
      `🚨 'generateRoute' Failed cause in route "${route}":\n${errors.join(
        "\n"
      )}`
    );
  }

  return route
    .replace(/\[(\w+)\]/g, (_, key) => {
      return (params[key as keyof typeof params] as string)
        .trim()
        .replace(/^\/+|\/+$/g, "");
    })
    .replace(/\/+/g, "/");
}
