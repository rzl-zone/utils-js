/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  isArray,
  isEmptyArray,
  isNull,
  isObject,
  isString,
  isUndefined,
} from "@/index";
import type { SafeJsonParseResult, UnknownValue } from "./safeJsonParse.types";
import type { IsAny } from "@/types";

/** --------------------------------------------------
 * * ***Options for cleaning and transforming parsed JSON data.***
 * --------------------------------------------------
 */
interface CleanParsedDataOptions {
  /** Convert numeric strings to numbers (e.g., `"42"` → `42`).
   *
   * @default false
   */
  convertNumbers?: boolean;

  /** Convert `"true"` / `"false"` strings to boolean values.
   *
   * @default false
   */
  convertBooleans?: boolean;

  /** Convert valid date strings into `Date` objects.
   *
   * @default false
   */
  convertDates?: boolean;

  /** Custom date formats to be parsed (e.g., `["DD/MM/YYYY", "MM/DD/YYYY"]`).
   *
   * @default []
   */
  customDateFormats?: string[];

  /** Remove `null` values from objects and arrays.
   *
   * @default false
   */
  removeNulls?: boolean;

  /**
   * Remove `undefined` values from objects and arrays.
   *
   * - `false` (default): replaces `undefined` with `null`
   * - `true`: removes keys with `undefined` values
   */
  removeUndefined?: boolean;

  /** Remove empty objects `{}` from the final output.
   *
   * @default false
   */
  removeEmptyObjects?: boolean;

  /** Remove empty arrays `[]` from the final output.
   *
   * @default false
   */
  removeEmptyArrays?: boolean;

  /** Strict mode: Removes values that do not match selected conversions.
   *
   * @default false
   */
  strictMode?: boolean;

  /** Enable error logging if JSON parsing fails.
   *
   * @default false
   */
  loggingOnFail?: boolean;

  /** Custom error handler function.
   *
   * @default undefined
   */
  onError?: (error: unknown) => void;
}

/** --------------------------------------------------
 * * ***Cleans parsed JSON data based on provided options.***
 * --------------------------------------------------
 *
 * @template T - Expected output type.
 * @param {unknown} data - The parsed JSON data.
 * @param {CleanParsedDataOptions} options - Cleaning options.
 * @returns {T | undefined} - The cleaned data.
 *
 * **Note: If using `convertDates`, result may contain Date objects. You may need type assertions in strict TypeScript settings.**
 *
 * @example
 * // Convert numbers and remove nulls
 * const result = cleanParsedData({ age: "25", name: null }, { convertNumbers: true, removeNulls: true });
 * console.log(result); // Output: { age: 25 }
 *
 * @example
 * // Convert boolean strings
 * const result = cleanParsedData({ isActive: "true" }, { convertBooleans: true });
 * console.log(result); // Output: { isActive: true }
 */
export const cleanParsedData = <T = unknown>(
  data: T,
  options: CleanParsedDataOptions = {}
): T | undefined | null => {
  if (!isObject(options)) {
    throw new TypeError(
      `props 'options' must be \`object\` or empty as \`undefined\` type!`
    );
  }

  if (isNull(data)) return options.removeNulls ? undefined : null;
  if (isUndefined(data)) return options.removeUndefined ? undefined : undefined;

  if (isArray(data)) {
    const cleanedArray = data
      .map((item) => cleanParsedData(item, options))
      .filter((item) => !isUndefined(item));

    return options.removeEmptyArrays && isEmptyArray(cleanedArray)
      ? undefined
      : (cleanedArray as T);
  }

  if (isObject(data)) {
    const cleanedObject: Record<string, unknown> = {};
    const obj = data as Record<string, unknown>;

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const cleanedValue = cleanParsedData(obj[key], options);
        if (!isUndefined(cleanedValue)) {
          cleanedObject[key] = cleanedValue;
        }
      }
    }

    return options.removeEmptyObjects && Object.keys(cleanedObject).length === 0
      ? undefined
      : (cleanedObject as T);
  }

  if (isString(data)) {
    const trimmed = data.trim();

    if (options.convertNumbers && !isNaN(Number(trimmed))) {
      return Number(trimmed) as T;
    }

    if (options.convertBooleans) {
      if (trimmed === "true") return true as T;
      if (trimmed === "false") return false as T;
    }

    if (options.convertDates) {
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(trimmed)) {
        return new Date(trimmed) as T;
      }

      if (options.customDateFormats?.length) {
        for (const format of options.customDateFormats) {
          const date = parseCustomDate(trimmed, format);
          if (date) return date as T;
        }
      }
    }

    return options.strictMode ? undefined : (trimmed as T);
  }

  return options.strictMode ? undefined : data;
};

/** --------------------------------------------------
 * * ***Parses custom date formats like "DD/MM/YYYY" or "MM/DD/YYYY".***
 * --------------------------------------------------
 *
 * @param {string} dateString - Date string to parse.
 * @param {string} format - Date format to match.
 * @returns {Date | null} - Returns a Date object if valid, otherwise null.
 */
export const parseCustomDate = (
  dateString: string,
  format: string
): Date | null => {
  if (!isString(dateString) || !isString(format)) {
    throw new TypeError(
      `props 'dateString' and 'format' must be \`string\` type!`
    );
  }

  const dateParts = dateString.split(/[-/]/).map(Number);
  if (dateParts.length !== 3 || dateParts.some(isNaN)) return null;

  let day: number, month: number, year: number;

  if (format === "DD/MM/YYYY") {
    [day, month, year] = dateParts;
  } else if (format === "MM/DD/YYYY") {
    [month, day, year] = dateParts;
  } else {
    return null;
  }

  month -= 1;
  const date = new Date(year, month, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
};

/** --------------------------------------------------
 * * ***Safely parses JSON while handling errors and applying transformations.***
 * --------------------------------------------------
 *
 * - ✅ **Supports generics** to ensure accurate return type inference.
 *    - Always provide both `<TData, TInput>` for best results.
 *    - ***Scroll down for full generic behavior explanation.***
 * - ✅ Automatically parses valid JSON strings into objects, arrays, numbers, etc.
 * - ✅ Supports data transformation via options (e.g., convert strings to numbers, booleans, or dates).
 * - ✅ Returns:
 *    1. `null` → if input is explicitly `null`.
 *    2. `undefined` → if input is `undefined`, not a string, or if parsing fails.
 *    3. Parsed and cleaned result (`TData`) → if input is a valid JSON string.
 *
 * ⚠ **JSON.stringify note**: If the input JSON string was created using `JSON.stringify()`, any properties with
 *    `undefined` values would have been automatically removed or converted to `null` depending on the serializer.
 *    Example:
 *    ```ts
 *    JSON.stringify({ a: undefined, b: 1 }); // → '{"b":1}'
 *    JSON.parse('{"a": undefined, "b": 1}')  // ❌ invalid JSON
 *
 *    safeJsonParse('{"name": "John", "score": undefined}');
 *    // result → { name:"John", score:null } ← because `undefined` is not valid JSON, gets replaced
 *    ```
 *    Therefore, if you see `undefined` in raw input, it will likely throw unless pre-cleaned or replaced with `null`.
 * @template TData - The expected output type after parsing and cleaning.
 * @template TInput - The input value type, used for advanced type inference and return typing.
 *
 * @param {TInput} value - The JSON string or value to parse.
 * @param {CleanParsedDataOptions} [options] - Options to clean, convert types, enable strict mode,
 *   support custom date formats, enable logging, or handle errors via callback.
 *
 * @returns {SafeJsonParseResult<TData, TInput>} Parsed and optionally cleaned result, or `null`/`undefined`.
 *
 * @throws {TypeError} If `options` is provided but not a valid object.
 *
 * @example
 * 1. ***Basic parse with number & boolean conversion:***
 *  ```ts
 *    const result = safeJsonParse('{"age": "30", "isActive": "true"}', {
 *      convertNumbers: true,
 *      convertBooleans: true
 *    });
 *    // result → { age: 30, isActive: true }
 *  ```
 * 2. ***Handling `undefined` in input string (manually written, not JSON.stringify):***
 *  ```ts
 *    const result = safeJsonParse('{"score": undefined}');
 *    // result → { score: null } ← because `undefined` is not valid JSON, gets replaced
 *  ```
 *
 * 3. ***Strict mode (removes invalid values):***
 *  ```ts
 *    const result = safeJsonParse('{"name": "   ", "score": "99abc"}', {
 *      convertNumbers: true,
 *      strictMode: true
 *    });
 *    // result → {}
 *
 *    const result2 = safeJsonParse('{"name": "   ", "score": undefined}');
 *    // result2 → { name:"",score: null }
 *  ```
 *
 * 4. ***Custom date format parsing:***
 *  ```ts
 *    const result = safeJsonParse('{"birthday": "25/12/2000"}', {
 *      convertDates: true,
 *      customDateFormats: ["DD/MM/YYYY"]
 *    });
 *    // result → { birthday: new Date("2000-12-25T00:00:00.000Z") }
 *  ```
 *
 * 5. ***Invalid JSON with custom error handling:***
 *  ```ts
 *    safeJsonParse("{invalid}", {
 *      loggingOnFail: true,
 *      onError: (err) => console.log("Custom handler:", err.message)
 *    });
 *    // → Logs parsing error and invokes handler
 *  ```
 *
 * 6. ***Null or non-string input returns null/undefined:***
 *  ```ts
 *    safeJsonParse(null); // → null
 *    safeJsonParse(undefined); // → undefined
 *    safeJsonParse(123); // → undefined
 *  ```
 *
 * 7. ***Generic usage: Provide both output and input type to ensure correct return typing:***
 *  ```ts
 *    type UserType = { name: string };
 *
 *    const obj = JSON.stringify({
 *      name: "John"
 *    });
 *
 *    const toParse = isAuth() ? obj : null;
 *    const toParse2 = isAuth() ? obj : undefined;
 *
 *    // * `Without Generic`:
 *      const parsed = safeJsonParse(toParse);
 *      //- runtime: { name: "John" } | undefined | null
 *      //- type: Record<string, unknown> | undefined | null
 *      const parsed2 = safeJsonParse(toParse);
 *      //- runtime: { name: "John" } | undefined
 *      //- type: Record<string, unknown> | undefined
 *
 *    // * `With Generic`:
 *      const parsed = safeJsonParse<UserType>(toParse);
 *      //- runtime: { name: "John" } | undefined | null
 *      //- type: undefined  ← (⚠ unexpected!)
 *      const parsed2 = safeJsonParse<UserType>(toParse);
 *      //- runtime: { name: "John" } | undefined
 *      //- type: undefined  ← (⚠ unexpected!)
 *      const parsed = safeJsonParse<UserType, typeof toParse>(toParse);
 *      //- runtime: { name: "John" } | null | undefined
 *      //- type: UserType | null | undefined
 *      const parsed2 = safeJsonParse<UserType, typeof toParse>(toParse);
 *      //- runtime: { name: "John" } | undefined
 *      //- type: UserType | undefined
 *  ```
 * @note
 * ⚠ **Generic Behavior:**
 * - This function supports advanced generic inference for clean, type-safe return values.
 * - If only the first generic (`TData`) is provided and the second (`TInput`) is omitted,
 *   then `TInput` defaults to `undefined`, resulting in a return type of `undefined`.
 * - To ensure correct return typing, **always pass both generics** when `value` is dynamic,
 *   nullable, or unioned: `safeJsonParse<TData, typeof value>(value)`.
 * - This makes the returned type exactly match your expectation: `TData | null | undefined`.
 */
export function safeJsonParse<
  TData extends Record<string, any> = Record<string, unknown>,
  TInput extends UnknownValue = UnknownValue
>(
  value: TInput,
  options?: CleanParsedDataOptions
): IsAny<TInput> extends true ? TData | null | undefined : undefined;
export function safeJsonParse<
  TData extends Record<string, any> = Record<string, unknown>,
  TInput extends string | null | undefined | unknown = undefined
>(
  value: TInput,
  options?: CleanParsedDataOptions
): SafeJsonParseResult<TData, TInput>;
//! implement main function
export function safeJsonParse<TData extends Record<string, unknown>>(
  value?: unknown,
  options: CleanParsedDataOptions = {}
) {
  if (isNull(value)) return null;
  if (!isString(value)) return undefined;

  if (!isObject(options)) {
    throw new TypeError(
      `props 'options' must be \`object\` or empty as \`undefined\` type!`
    );
  }

  try {
    const normalized = options.removeUndefined
      ? value
          .replace(/,\s*"[^"]*"\s*:\s*undefined(?=\s*[},])/g, "") // remove , "key": undefined
          .replace(/"[^"]*"\s*:\s*undefined\s*(,)?/g, "") // remove "key": undefined
          .replace(/,(\s*[}\]])/g, "$1") // <- remove trailing comma before } or ]
      : value.replace(/:\s*undefined(?=\s*[,}])/g, ":null");

    const parsed = JSON.parse(normalized);
    return cleanParsedData<TData>(parsed, options);
  } catch (error) {
    if (options.loggingOnFail) {
      console.error("JSON parsing failed from `safeJsonParse`:", error);
    }
    if (options.onError) {
      options.onError(error);
    }
    return undefined;
  }
}
