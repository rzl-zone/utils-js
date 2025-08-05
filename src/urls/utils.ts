import {
  isBoolean,
  isNonEmptyString,
  isObject,
  isUndefined,
} from "@/predicates";

/** -----------------------------------------------
 * * ***Retrieves and formats an environment port variable.***
 * -----------------------------------------------
 *
 * - Extracts only digits from the input.
 * - If no digits found, returns an empty string.
 * - By default does NOT prefix with a colon.
 *   Use `{ prefixColon: true }` to prefix with a colon.
 *
 * @param envVar The environment variable string.
 * @param options Optional object: `{ prefixColon?: boolean }`.
 * @returns A string like ":8080" or "8080", or "" if no digits.
 *
 * @throws TypeError if `options` is not an object or `prefixColon` is not boolean.
 *
 * @example
 * formatEnvPort("port:8080");           // "8080"
 * formatEnvPort("port:8080", { prefixColon: true }); // ":8080"
 */
export const formatEnvPort = (
  envVar?: string | null,
  options?: {
    /** Add prefix with a colon.
     *
     * @default false
     */
    prefixColon?: boolean;
  }
): string => {
  if (!isNonEmptyString(envVar)) return ""; // Handle empty string case

  if (!isUndefined(options)) {
    if (!isObject(options)) {
      throw new TypeError("Options must be an object.");
    }
    if ("prefixColon" in options && !isBoolean(options.prefixColon)) {
      throw new TypeError("Option `prefixColon` must be a boolean.");
    }
  }

  const digitsOnly = envVar.replace(/\D+/g, "");
  if (!digitsOnly) return "";

  const prefixColon = options?.prefixColon ?? false;

  return prefixColon ? `:${digitsOnly}` : digitsOnly;
};
