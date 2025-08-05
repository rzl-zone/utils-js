import { isBoolean, isNull, isString } from "@/predicates";

/* eslint-disable @typescript-eslint/no-unused-vars */
type StringOrNull = string | null;
type NullOrUndefined = null | undefined;

type UnknownObject = Record<string, unknown>;

/**
 * @deprecated Use `safeJsonParse` instead.
 *
 * Safe JSON parsing with error handling.
 *
 * - ✅ Returns `null` if input is `null`.
 * - ✅ Returns `undefined` if input is not a valid JSON string.
 * - ✅ Supports strict type inference using generics.
 * - ✅ Allows custom error logging via callback.
 *
 *
 * @template T - Expected output type.
 * @param {string | null | undefined} value - The JSON string to parse.
 * @param {boolean} [loggingOnFail=false] - Whether to log errors.
 * @param {(error: unknown) => void} [onError] - Custom error handler callback.
 *
 * @returns {T | undefined | null} - The parsed value or `undefined` if parsing fails.
 *
 * @example
 * // Valid JSON parsing
 * console.log(safeJsonParse<{ foo: string }>('{"foo": "bar"}'));
 * // Output: { foo: "bar" }
 *
 * @example
 * // Invalid JSON handling
 * console.log(safeJsonParse("invalid json"));
 * // Output: undefined
 *
 * @example
 * // Parsing `null` value
 * console.log(safeJsonParse(null));
 * // Output: null
 *
 * @example
 * // Logging error when parsing fails
 * console.log(safeJsonParse("invalid", true));
 * // Logs: JSON parsing failed from `safeJsonParse`: <error>
 * // Output: undefined
 *
 * @example
 * // Custom error handling
 * console.log(safeJsonParse("invalid", false, (err) => console.warn("Custom error:", err)));
 * // Logs: Custom error: <error>
 * // Output: undefined
 *
 */
export function safeJsonParseDeprecated<AsType>(
  value: null,
  loggingOnFail?: false,
  onError?: undefined
): null;

export function safeJsonParseDeprecated<AsType>(
  value: undefined,
  loggingOnFail?: false,
  onError?: undefined
): undefined;

export function safeJsonParseDeprecated<AsType = UnknownObject>(
  value: string,
  loggingOnFail?: boolean,
  onError?: (error: unknown) => void
): AsType;

export function safeJsonParseDeprecated<AsType = UnknownObject>(
  value: StringOrNull,
  loggingOnFail?: boolean,
  onError?: (error: unknown) => void
): AsType | null;

export function safeJsonParseDeprecated<AsType = UnknownObject>(
  value?: string,
  loggingOnFail?: boolean,
  onError?: (error: unknown) => void
): AsType | undefined;

export function safeJsonParseDeprecated<AsType = UnknownObject>(
  value?: StringOrNull,
  loggingOnFail?: boolean,
  onError?: (error: unknown) => void
): AsType | NullOrUndefined;

export function safeJsonParseDeprecated<AsType = unknown>(
  value?: StringOrNull,
  loggingOnFail: boolean = false,
  onError?: (error: unknown) => void
): AsType | NullOrUndefined {
  if (isNull(value)) return null;
  if (!isString(value)) return undefined;

  if (!isBoolean(loggingOnFail)) {
    throw new TypeError(
      `props 'loggingOnFail' must be \`boolean\` or empty as \`undefined\` type!`
    );
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    if (loggingOnFail) {
      console.error("JSON parsing failed from `safeJsonParse`:", error);
    }
    if (onError) {
      onError(error);
    }
    return undefined;
  }
}
