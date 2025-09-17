/* eslint-disable no-useless-escape */

import { isNaN } from "../is/isNaN";
import { isNull } from "../is/isNull";
import { isError } from "../is/isError";
import { isObject } from "../is/isObject";
import { isBuffer } from "../is/isBuffer";
import { isFunction } from "../is/isFunction";
import { isPlainObject } from "../is/isPlainObject";
import { isObjectOrArray } from "../is/isObjectOrArray";
import { isNumberObject } from "../is/isNumberObject";
import { isStringObject } from "../is/isStringObject";
import { isBooleanObject } from "../is/isBooleanObject";
import { isInfinityNumber } from "../is/isInfinityNumber";
import { __internalAcronyms__, FIXES_RAW } from "./getPreciseType.utils";

import { slugify } from "@/strings/cases/slugify";
import { toDotCase } from "@/strings/cases/toDotCase";
import { toCamelCase } from "@/strings/cases/toCamelCase";
import { toKebabCase } from "@/strings/cases/toKebabCase";
import { toSnakeCase } from "@/strings/cases/toSnakeCase";
import { toLowerCase } from "@/strings/cases/toLowerCase";
import { toPascalCase } from "@/strings/cases/toPascalCase";
import { toPascalCaseSpace } from "@/strings/cases/toPascalCaseSpace";

/** Normalize a string key for consistent lookup.
 *
 * Removes spaces, underscores, and hyphens,
 * then converts all characters to lowercase.
 *
 * @param {string} k - The input key string to normalize.
 * @returns {string} The normalized lowercase key without spaces or symbols.
 *
 */
const normalizeKey = (k: string): string => k.replace(/[\s_\-]+/g, "").toLowerCase();

/** Pre-computes a normalized FIXES lookup table to allow flexible case- and separator-insensitive matching of type keys. */
const FIXES: Record<string, string> = Object.entries(FIXES_RAW).reduce((acc, [k, v]) => {
  acc[normalizeKey(k)] = v;
  return acc;
}, {} as Record<string, string>);

/** Detects if a value is a Proxy by attempting to define/delete a property.
 *
 * This works because Proxy traps will throw or behave differently on such operations.
 *
 * Note: Transparent Proxy without traps will NOT be detected.
 *
 * @param {unknown} value - Value to test
 * @returns {boolean} True if likely a Proxy, false otherwise
 */
function isProxy(value: unknown): boolean {
  if (typeof value !== "object" || value === null) return false;

  // Some built-in types we can exclude early to avoid false positives
  const tag = Object.prototype.toString.call(value);
  const skipTags = [
    "[object Array]",
    "[object Date]",
    "[object RegExp]",
    "[object Map]",
    "[object Set]",
    "[object WeakMap]",
    "[object WeakSet]",
    "[object Function]",
    "[object Error]",
    "[object Promise]",
    "[object Generator]",
    "[object GeneratorFunction]",
    "[object AsyncFunction]"
  ];
  if (skipTags.includes(tag)) return false;

  try {
    Reflect.defineProperty(value, "__proxy_detect__", {
      configurable: true,
      value: 1
    });
    Reflect.deleteProperty(value, "__proxy_detect__");
    return false;
  } catch {
    return true;
  }
}

/** ----------------------------------------------------------
 * * ***Helper function to convert an input string to a specific casing/format.***
 * ----------------------------------------------------------
 *
 * @description
 * - Chooses the conversion function based on the `formatCase` option.
 * - Supports multiple casing/formatting functions:
 *   - `toPascalCaseSpace`.
 *   - `toPascalCase`.
 *   - `toCamelCase`.
 *   - `toKebabCase`.
 *   - `toSnakeCase`.
 *   - `toDotCase`.
 *   - `slugify`.
 * - Uses `__internalAcronyms__` as ignored words for certain conversion functions.
 *
 * @param {string} input - The string to convert.
 * @param {GetPreciseTypeOptions["formatCase"]} formatCase - The conversion method to apply.
 * @returns {string} The converted string according to the selected format.
 *
 * @example
 * converterHelper("hello world", "toCamelCase");
 * // ➔ "helloWorld"
 *
 * @example
 * converterHelper("my URL path", "slugify");
 * // ➔ "my-URL-path"
 */
const converterHelper = (
  input: string,
  formatCase: GetPreciseTypeOptions["formatCase"]
): string => {
  if (formatCase === "toPascalCaseSpace")
    return toPascalCaseSpace(input, __internalAcronyms__);
  if (formatCase === "slugify") return slugify(input, __internalAcronyms__);
  if (formatCase === "toCamelCase") return toCamelCase(input, __internalAcronyms__);
  if (formatCase === "toDotCase") return toDotCase(input, __internalAcronyms__);
  if (formatCase === "toKebabCase") return toKebabCase(input, __internalAcronyms__);
  if (formatCase === "toPascalCase") return toPascalCase(input, __internalAcronyms__);
  if (formatCase === "toSnakeCase") return toSnakeCase(input, __internalAcronyms__);

  return toLowerCase(input, __internalAcronyms__);
};

/** ---------------------------------------------------------------------------
 * * ***Type Options for {@link getPreciseType | `getPreciseType`}.***
 * ---------------------------------------------------------------------------
 */
export type GetPreciseTypeOptions = {
  /** -------------------------------------------------------
   * * ***Specifies the format in which the returned string type should be transformed.***
   * -------------------------------------------------------
   * **ℹ️ For special string literals in `SPECIAL_CASES` (`"-Infinity" | "Infinity" | "NaN"`), which will remain unchanged.**
   * @default "toLowerCase"
   * @description
   * Supported formats:
   * - `"toLowerCase"` (default) — converts all letters to lowercase.
   *   - ➔ `"result example type"`
   * - `"toDotCase"` — words separated by dots.
   *   - ➔ `"result.example.type"`
   * - `"toCamelCase"` — first word lowercase, subsequent words capitalized.
   *   - ➔ `"resultExampleType"`
   * - `"toKebabCase"` — words separated by hyphens.
   *   - ➔ `"result-example-type"`
   * - `"toSnakeCase"` — words separated by underscores.
   *   - ➔ `"result_example_type"`
   * - `"toPascalCase"` — all words capitalized, no spaces.
   *   - ➔ `"ResultExampleType"`
   * - `"toPascalCaseSpace"` — all words capitalized with spaces between words.
   *   - ➔ `"Result Example Type"`
   * - `"slugify"` — URL-friendly slug (lowercase with hyphens).
   *   - ➔ `"result-example-type"`
   * @note
   * ⚠️ If an invalid value is provided, the function will automatically fallback to the default `"toLowerCase"`.
   */
  formatCase?:
    | "toPascalCaseSpace"
    | "toPascalCase"
    | "toCamelCase"
    | "toKebabCase"
    | "toSnakeCase"
    | "toDotCase"
    | "slugify"
    | "toLowerCase";
};

/** ----------------------------------------------------------
 * * ***Utility-Predicate: `getPreciseType`.***
 * ----------------------------------------------------------
 * **Returns a detailed and normalized type string for the given value.**
 * @description
 * The returned string is human-readable _**toLowerCase**_ with spaces _***(by default)***_ or formatted according to the `options.formatCase` setting.
 * - **Handles:**
 *    - Primitives (`string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`)
 *    - Built-in objects (`Array`, `Map`, `Set`, `Error subclasses`, `Typed Arrays`, `etc`)
 *    - Objects created with `Object.create(null)`
 *    - Generator instances
 *    - Node.js `Buffer` instances
 *    - Proxy detection (returns `"Proxy"` if detected; detection is not 100% accurate)
 *    - Uses cached mapping table (`FIXES`) for known types to provide consistent naming
 *    - Falls back to constructor name or `Object.prototype.toString` tag
 * @param {*} value - The value to detect the precise type of
 * @param {GetPreciseTypeOptions} [options] - Optional configuration
 * @param {GetPreciseTypeOptions["formatCase"]} [options.formatCase="toLowerCase"]
 *   Specifies how the returned type string should be formatted.
 *   - ⚠️ Special string literals in `SPECIAL_CASES`
 *     (`"-Infinity" | "Infinity" | "NaN"`) will remain
 *     unchanged even if a different `formatCase` is applied.
 * @returns {string} The normalized and formatted type string
 * @example
 * getPreciseType(123);  // ➔ "number"
 * getPreciseType(null); // ➔ "null"
 * getPreciseType(/regex/,{ formatCase: "toKebabCase" });
 * // ➔ "reg-exp"
 * getPreciseType(function* () {}, { formatCase: "toCamelCase" });
 * // ➔ "generatorFunction"
 * getPreciseType(async function () {}, { formatCase: "toPascalCaseSpace" });
 * // ➔ "Async Function"
 * getPreciseType(NaN, { formatCase: "toKebabCase" });
 * // ➔ "NaN" (SPECIAL_CASES remain)
 */
export const getPreciseType = (
  value: unknown,
  options: GetPreciseTypeOptions = { formatCase: "toLowerCase" }
): string => {
  if (!isPlainObject(options)) options = {};

  const formatCase = options.formatCase;

  // Handle null explicitly, because typeof null === "object"
  if (isNull(value)) {
    // Use normalized "null" label from FIXES dictionary or fallback to "Null"
    return converterHelper(FIXES[normalizeKey("null")] ?? "Null", formatCase);
  }

  if (isNaN(value)) return "NaN";
  if (isInfinityNumber(value)) return String(value);

  if (isNumberObject(value)) return converterHelper("Number Constructor", formatCase);
  if (isStringObject(value)) return converterHelper("String Constructor", formatCase);
  if (isBooleanObject(value)) return converterHelper("Boolean Constructor", formatCase);

  // Get the primitive typeof string
  const prim = typeof value;

  // For all primitives except objects and functions, return mapped or formatted type
  if (!isObjectOrArray(value) && !isFunction(value)) {
    // Try to find a friendly name in FIXES, otherwise convert primitive name to spaced PascalCase
    return converterHelper(FIXES[normalizeKey(prim)] ?? prim, formatCase);
  }

  // Node.js Buffer detection: Buffer is subclass of Uint8Array but special
  if (isBuffer(value)) {
    return converterHelper(FIXES[normalizeKey("buffer")] ?? "Buffer", formatCase);
  }

  // If the value is detected as a Proxy, return "Proxy"
  if (isProxy(value)) {
    return converterHelper(FIXES[normalizeKey("proxy")] ?? "Proxy", formatCase);
  }

  // Detect Generator objects by presence of `.next` and `.throw` functions
  if (
    isObject(value) &&
    isFunction((value as Record<string, unknown>)?.next) &&
    isFunction((value as Record<string, unknown>)?.throw)
  ) {
    return converterHelper(FIXES[normalizeKey("generator")] ?? "Generator", formatCase);
  }

  // Handle Error instances and subclasses, returning their constructor name
  if (isError(value)) {
    const ctorName = value.constructor?.name ?? "Error";
    // Try FIXES dictionary with constructor name, else fallback to spaced PascalCase
    return converterHelper(
      FIXES[normalizeKey(ctorName)] ??
        FIXES[normalizeKey(ctorName.replace(/\s+/g, ""))] ??
        ctorName,
      formatCase
    );
  }

  // Handle objects created with `Object.create(null)` which have null prototype
  if (isNull(Object.getPrototypeOf(value))) {
    return converterHelper(FIXES[normalizeKey("object")] ?? "Object", formatCase);
  }

  // Get the internal [[Class]] tag from Object.prototype.toString, e.g. "Date", "Map"
  const tag = Object.prototype.toString.call(value).slice(8, -1) || "Object";

  // Check if tag has a mapped friendly name in FIXES dictionary
  const mapped = FIXES[normalizeKey(tag)];
  if (mapped) return converterHelper(mapped, formatCase);

  // Fallback: try to get constructor name and use that if not "Object"
  const ctorName = value?.constructor?.name;
  if (ctorName && ctorName !== "Object") {
    return converterHelper(FIXES[normalizeKey(ctorName)] ?? ctorName, formatCase);
  }

  // Final fallback: format the tag string to spaced PascalCase and return
  return converterHelper(tag, formatCase);
};
