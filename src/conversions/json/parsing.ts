/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IsAny } from "@/types";
import type { SafeJsonParseResult, UnknownValue } from "./safeJsonParse.types";

import { isNaN } from "@/predicates/is/isNaN";
import { isNull } from "@/predicates/is/isNull";
import { isError } from "@/predicates/is/isError";
import { isArray } from "@/predicates/is/isArray";
import { isNumber } from "@/predicates/is/isNumber";
import { isObject } from "@/predicates/is/isObject";
import { isString } from "@/predicates/is/isString";
import { isBoolean } from "@/predicates/is/isBoolean";
import { isFunction } from "@/predicates/is/isFunction";
import { hasOwnProp } from "@/predicates/has/hasOwnProp";
import { isUndefined } from "@/predicates/is/isUndefined";
import { isEmptyArray } from "@/predicates/is/isEmptyArray";
import { isEmptyObject } from "@/predicates/is/isEmptyObject";
import { getPreciseType } from "@/predicates/type/getPreciseType";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";

import { noop } from "@/generator/utils/noop";
import { assertIsPlainObject } from "@/assertions/objects/assertIsPlainObject";

import { extractDigits } from "../numerics/extractDigits";
import { safeStableStringify } from "../stringify";

/** --------------------------------------------------
 * * ***Options for cleaning and transforming parsed JSON data.***
 * --------------------------------------------------
 */
type ParseParsedDataOptions = {
  /** Convert numeric strings to numbers (e.g., `"42"` ➔ `42`), defaultValue: `false`.
   *
   * @default false
   */
  convertNumbers?: boolean;

  /** Convert numeric strings "NaN" to NaN (e.g., `"NaN"` ➔ `NaN`), defaultValue: `false`.
   *
   * @default false
   */
  convertNaN?: boolean;

  /** Convert `"true"` / `"false"` strings to boolean values, defaultValue: `false`.
   *
   * @default false
   */
  convertBooleans?: boolean;

  /** Convert valid date strings into `Date` objects, defaultValue: `false`.
   *
   * @default false
   */
  convertDates?: boolean;

  /** Custom date formats to be parsed (e.g., `["DD/MM/YYYY", "MM/DD/YYYY"]`), defaultValue: `[]`.
   *
   * @default []
   */
  customDateFormats?: string[];

  /** Remove `null` values from objects and arrays, defaultValue: `false`.
   *
   * @default false
   */
  removeNulls?: boolean;

  /** Remove `undefined` values from objects and arrays, defaultValue: `false`.
   *
   * - `false` (default): replaces `undefined` with `null`
   * - `true`: removes keys with `undefined` values
   *
   * @default false
   */
  removeUndefined?: boolean;

  /** Remove empty objects `{}` from the final output, defaultValue: `false`.
   *
   * @default false
   */
  removeEmptyObjects?: boolean;

  /** Remove empty arrays `[]` from the final output, defaultValue: `false`.
   *
   * @default false
   */
  removeEmptyArrays?: boolean;

  /** Strict mode: Removes values that do not match selected conversions, defaultValue: `false`.
   *
   * @default false
   */
  strictMode?: boolean;

  /** Enable error logging if JSON parsing fails, defaultValue: `false`.
   *
   * @default false
   */
  loggingOnFail?: boolean;

  /** Custom error handler function.
   *
   * - If provided, it will be called with the error.
   *
   * - If not provided, defaults to `undefined` in type, but internally a no-op function is used.
   *
   * @default undefined
   */
  onError?: (error: Error) => void;

  /**
   * Whether to check symbol properties when checking empty objects.
   * @default false
   */
  checkSymbols?: boolean;
};

/** Private Helper for Options Validation */
const validateOptions = (
  optionsValue: ParseParsedDataOptions = {}
): Required<ParseParsedDataOptions> => {
  assertIsPlainObject(optionsValue, {
    message: ({ currentType, validType }) =>
      `Second parameter (\`options\`) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });

  const convertBooleans = hasOwnProp(optionsValue, "convertBooleans")
    ? optionsValue.convertBooleans
    : false;
  const convertDates = hasOwnProp(optionsValue, "convertDates")
    ? optionsValue.convertDates
    : false;
  const convertNumbers = hasOwnProp(optionsValue, "convertNumbers")
    ? optionsValue.convertNumbers
    : false;
  const loggingOnFail = hasOwnProp(optionsValue, "loggingOnFail")
    ? optionsValue.loggingOnFail
    : false;
  const removeEmptyArrays = hasOwnProp(optionsValue, "removeEmptyArrays")
    ? optionsValue.removeEmptyArrays
    : false;
  const removeEmptyObjects = hasOwnProp(optionsValue, "removeEmptyObjects")
    ? optionsValue.removeEmptyObjects
    : false;
  const removeNulls = hasOwnProp(optionsValue, "removeNulls")
    ? optionsValue.removeNulls
    : false;
  const removeUndefined = hasOwnProp(optionsValue, "removeUndefined")
    ? optionsValue.removeUndefined
    : false;
  const strictMode = hasOwnProp(optionsValue, "strictMode")
    ? optionsValue.strictMode
    : false;
  const checkSymbols = hasOwnProp(optionsValue, "checkSymbols")
    ? optionsValue.checkSymbols
    : false;
  const convertNaN = hasOwnProp(optionsValue, "convertNaN")
    ? optionsValue.convertNaN
    : false;

  const customDateFormats = hasOwnProp(optionsValue, "customDateFormats")
    ? optionsValue.customDateFormats
    : [];
  const onError = hasOwnProp(optionsValue, "onError") ? optionsValue.onError : noop;

  if (
    !(
      isBoolean(convertBooleans) &&
      isBoolean(convertDates) &&
      isBoolean(convertNumbers) &&
      isBoolean(convertNaN) &&
      isBoolean(checkSymbols) &&
      isBoolean(loggingOnFail) &&
      isBoolean(removeEmptyArrays) &&
      isBoolean(removeEmptyObjects) &&
      isBoolean(removeNulls) &&
      isBoolean(removeUndefined) &&
      isBoolean(strictMode) &&
      isArray(customDateFormats) &&
      isFunction(onError)
    )
  ) {
    throw new TypeError(
      `Invalid \`options\` parameter (second argument): \`convertBooleans\`, \`convertDates\`, \`convertNumbers\`, \`loggingOnFail\`, \`removeEmptyArrays\`, \`removeEmptyObjects\`, \`removeNulls\`, \`removeUndefined\`, \`strictMode\` expected to be a \`boolean\` type, \`customDateFormats\` expected to be a \`array\` type and \`onError\` expected to be a \`void function\` type. But received: ['convertBooleans': \`${getPreciseType(
        convertBooleans
      )}\`, 'convertDates': \`${getPreciseType(
        convertDates
      )}\`, 'convertNumbers': \`${getPreciseType(
        convertNumbers
      )}\`, 'loggingOnFail': \`${getPreciseType(
        loggingOnFail
      )}\`, 'removeEmptyArrays': \`${getPreciseType(
        removeEmptyArrays
      )}\`, 'removeEmptyObjects': \`${getPreciseType(
        removeEmptyObjects
      )}\`, 'removeNulls': \`${getPreciseType(
        removeNulls
      )}\`, 'removeUndefined': \`${getPreciseType(
        removeUndefined
      )}\`, 'strictMode': \`${getPreciseType(
        strictMode
      )}\`, 'customDateFormats': \`${getPreciseType(
        customDateFormats
      )}\`, 'onError': \`${getPreciseType(onError)}\`].`
    );
  }

  return {
    convertBooleans,
    convertDates,
    convertNumbers,
    convertNaN,
    loggingOnFail,
    removeEmptyArrays,
    removeEmptyObjects,
    removeNulls,
    removeUndefined,
    strictMode,
    customDateFormats,
    onError,
    checkSymbols
  };
};

/** --------------------------------------------------
 * * ***Utility: `cleanParsedData`.***
 * ---------------------------------------------
 * **Cleans parsed JSON data based on provided options.**
 * @template T - Expected output type.
 * @param {*} data - The parsed JSON data.
 * @param {ParseParsedDataOptions} [options] - Cleaning options.
 * @returns {T | null | undefined} The cleaned data.
 * - ***⚠️ Notice:*** _If data is JSON string, we recommend use **{@link safeJsonParse | `safeJsonParse`}** for more safe._
 * - ***⚠️ Note:*** _If using **`convertDates`** **options**, result may contain Date objects, you may need type assertions in strict TypeScript settings._
 * @example
 * ```ts
 * // 1: Convert numbers and remove nulls
 * const result = cleanParsedData({ age: "25", name: null }, {
 *    convertNumbers: true,
 *    removeNulls: true
 * });
 * console.log(result); // ➔ { age: 25 }
 * // 2: Convert boolean strings
 * const result = cleanParsedData({ isActive: "true" }, {
 *    convertBooleans: true
 * });
 * console.log(result); // ➔ { isActive: true }
 * ```
 */
export const cleanParsedData = <T = unknown>(
  data: T,
  options: ParseParsedDataOptions = {}
): T | undefined | null => {
  const validOptions = validateOptions(options);

  if (isNull(data)) return validOptions.removeNulls ? undefined : null;
  if (isUndefined(data)) return validOptions.removeUndefined ? undefined : undefined;

  if (isString(data)) {
    const trimmed = data.trim();

    if (validOptions.convertNaN && trimmed === "NaN") return NaN as T;

    if (validOptions.convertNumbers && !isNaN(Number(trimmed))) {
      return Number(trimmed) as T;
    }

    if (validOptions.convertBooleans) {
      if (trimmed === "true") return true as T;
      if (trimmed === "false") return false as T;
    }

    if (validOptions.convertDates) {
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(trimmed)) {
        return new Date(trimmed) as T;
      }

      if (validOptions.customDateFormats?.length) {
        for (const format of validOptions.customDateFormats) {
          const date = parseCustomDate(trimmed, format);
          if (date) return date as T;
        }
      }
    }

    return validOptions.strictMode ? undefined : (trimmed as T);
  }

  if (isArray(data)) {
    const cleanedArray = data
      .map((item) => cleanParsedData(item, validOptions))
      .filter((item) => !isUndefined(item));

    return validOptions.removeEmptyArrays && isEmptyArray(cleanedArray)
      ? undefined
      : (cleanedArray as T);
  }

  if (isObject(data)) {
    const cleanedObject: Record<string, unknown> = {};

    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const cleanedValue = cleanParsedData(data[key], validOptions);
        if (!isUndefined(cleanedValue)) {
          cleanedObject[key] = cleanedValue;
        }
      }
    }

    return validOptions.removeEmptyObjects &&
      isEmptyObject(cleanedObject, { checkSymbols: validOptions.checkSymbols })
      ? undefined
      : (cleanedObject as T);
  }

  return validOptions.strictMode ? undefined : data;
};

/** --------------------------------------------------
 * * ***Utility: `parseCustomDate`.***
 * ---------------------------------------------
 * **Parses custom date formats like "DD/MM/YYYY" or "MM/DD/YYYY".**
 * @param {string} dateString - Date string to parse.
 * @param {string} format - Date format to match.
 * @returns {Date | null} Returns a `Date` object if valid, otherwise `null`.
 * @throws {TypeError} Throw an type-error if `dateString` **(first parameter)** and `format` **(second parameter)** is not a string or empty-string.
 * @example
 * // Valid: European format (DD/MM/YYYY)
 * const date1 = parseCustomDate("03/09/2025", "DD/MM/YYYY");
 * console.log(date1); // ➔ Date { Wed Sep 03 2025 ... }
 *
 * // Valid: US format (MM/DD/YYYY)
 * const date2 = parseCustomDate("09/03/2025", "MM/DD/YYYY");
 * console.log(date2); // ➔ Date { Wed Sep 03 2025 ... }
 *
 * // Invalid: wrong format
 * const date3 = parseCustomDate("2025-09-03", "DD/MM/YYYY");
 * console.log(date3); // ➔ null
 *
 * // Invalid: non-date string
 * const date4 = parseCustomDate("hello", "DD/MM/YYYY");
 * console.log(date4); // ➔ null
 *
 * // Throws: wrong parameter types or empty-string
 * parseCustomDate(123, "DD/MM/YYYY");
 * // ➔ TypeError: Parameter `dateString` and `format` must be of type `string`...
 */
export const parseCustomDate = (dateString: string, format: string): Date | null => {
  if (!isNonEmptyString(dateString) || !isNonEmptyString(format)) {
    throw new TypeError(
      `Parameter \`dateString\` and \`format\` must be of type \`string\` and not empty-string, but received: "['dateString': \`${getPreciseType(
        dateString
      )}\` - (current value: \`${safeStableStringify(
        dateString
      )}\`), 'format': \`${getPreciseType(
        format
      )}\` - (current value: \`${safeStableStringify(format)}\`)]".`
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
 * * ***Utility: `safeJsonParse`.***
 * ---------------------------------------------
 * **Safely parses JSON while handling errors and applying transformations.**
 * - **Supports generics** to ensure accurate return type inference.
 *    - Always provide both `<TData, TInput>` for best results.
 *    - ℹ️ ***Scroll down for full generic behavior explanation.***
 * - Automatically parses valid JSON strings into `objects`, `arrays`, `numbers`, etc.
 * - Supports data transformation via options (e.g., convert strings to `numbers`, `booleans`, or `dates`).
 * - **Returns:**
 *    1. `null` ➔ if input is explicitly `null`.
 *    2. `undefined` ➔ if input is `undefined`, not a `string`, or if parsing fails.
 *    3. Parsed and cleaned result (`TData`) ➔ if input is a valid JSON string.
 * - ⚠️ **JSON.stringify note**:
 *    - _If the input JSON string was created using `JSON.stringify()`, any properties with `undefined`
 *      values would have been automatically removed or converted to `null` depending on the serializer, example:_
 *      ```ts
 *      JSON.stringify({ a: undefined, b: 1 }); // ➔ '{"b":1}'
 *      JSON.parse('{"a": undefined, "b": 1}')  // ❌ invalid JSON
 *      ```
 *      _Therefore, if you see `undefined` in raw input, it will likely throw unless pre-cleaned or replaced with `null`._
 *
 *      ```ts
 *      safeJsonParse('{"name": "John", "score": undefined}');
 *      // result ➔ { name: "John", score: null } <- because `undefined` is not valid JSON, gets replaced to null.
 *      ```
 * - ℹ️ **Additionally:**
 *    - This function normalizes single quotes (`'`) to double quotes (`"`) before parsing,
 *      so JSON strings using single quotes will be converted to valid JSON format, example:
 *      ```ts
 *      safeJsonParse("{'name': 'John', 'age': 30}");
 *      // result ➔ { name: "John", age: 30 }
 *
 *      safeJsonParse("{'string\\'s': 'abc', \"quote's\": 'It\\'s awesome!', 'aNumber\\'s': 123, 'keyWith\\'Backslash\\'s': 'value\\'s'}");
 *      // result ➔ { "string's": "abc", "quote's": "It's awesome!", "aNumber's": 123, "keyWith'Backslash's": "value's" }
 *      ```
 * @template TData - The expected output type after parsing and cleaning.
 * @template TInput - The input value type, used for advanced type inference and return typing.
 * @param {TInput} [value] - The JSON string or value to parse.
 * @param {ParseParsedDataOptions} [options] - Options to clean, convert types, enable strict mode,
 *   support custom date formats, enable logging, or handle errors via callback.
 * @returns {SafeJsonParseResult<TData, TInput>} Parsed and optionally cleaned result, or `null`/`undefined`.
 * @throws {TypeError} If `options` is provided but not a valid object.
 * @example
 * 1. ***Basic parse with number & boolean conversion:***
 *  ```ts
 *    const result = safeJsonParse(30);
 *    // result ➔ undefined
 *    const result = safeJsonParse(30, {
 *      convertNumbers: true
 *    });
 *    // result ➔ 30
 *
 *    const result = safeJsonParse('{"age": "30", "isActive": "true"}', {
 *      convertNumbers: true,
 *      convertBooleans: true
 *    });
 *    // result ➔ { age: 30, isActive: true }
 *  ```
 * 2. ***Handling `undefined` in input string (manually written, not JSON.stringify):***
 *  ```ts
 *    const result = safeJsonParse('{"score": undefined}');
 *    // result ➔ { score: null } <- because `undefined` is not valid JSON, gets replaced
 *  ```
 *
 * 3. ***Handling `NaN` in input string (manually written, not JSON.stringify):***
 *  ```ts
 *    const value = NaN; // <- value is NaN or "NaN";
 *    const result = safeJsonParse(value);
 *    // result ➔ undefined <- will return as undefined, because options `convertNaN` is false (default),
 *    const result2 = safeJsonParse(value, { convertNaN: true });
 *    // result2 ➔ NaN <- will return as undefined because options `convertNaN` is false,
 *
 *    const result4 = safeJsonParse('{"strNan": "NaN", "pureNan": NaN}');
 *    // NaN will convert to string (NaN ➔ "NaN") because options `convertNaN` is false (default),
 *    // result4 ➔ { strNan: "NaN", pureNan: "NaN" }
 *
 *    const result3 = safeJsonParse('{"strNan": "NaN", "pureNan": NaN}', {
 *      convertNaN: true
 *    });
 *    // String "NaN" will convert to NaN ("NaN" ➔ NaN) because options `convertNaN` is true,
 *    // result3 ➔ { strNan: NaN, pureNan: NaN }
 *  ```
 *
 * 4. ***Strict mode (removes invalid values):***
 *  ```ts
 *    const result = safeJsonParse('{"name": "   ", "score": "99abc"}', {
 *      convertNumbers: true,
 *      strictMode: true
 *    });
 *    // result ➔ {}
 *
 *    const result2 = safeJsonParse('{"name": "   ", "score": undefined}');
 *    // result2 ➔ { name: "",score: null }
 *  ```
 *
 * 5. ***Custom date format parsing:***
 *  ```ts
 *    const result = safeJsonParse('{"birthday": "25/12/2000"}', {
 *      convertDates: true,
 *      customDateFormats: ["DD/MM/YYYY"]
 *    });
 *    // result ➔ { birthday: new Date("2000-12-25T00:00:00.000Z") }
 *  ```
 *
 * 6. ***Invalid JSON with custom error handling:***
 *  ```ts
 *    safeJsonParse("{invalid}", {
 *      loggingOnFail: true,
 *      onError: (err) => console.log("Custom handler:", err.message)
 *    });
 *    // ➔ Logs parsing error and invokes handler
 *  ```
 *
 * 7. ***Null or non-string input returns null/undefined (default options):***
 *  ```ts
 *    safeJsonParse(123); // ➔ undefined
 *    safeJsonParse(null); // ➔ null
 *    safeJsonParse(undefined); // ➔ undefined
 *  ```
 *
 * 8. ***Generic usage: Provide both output and input type to ensure correct return typing:***
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
 *      //- type: undefined  <- (⚠️ unexpected!)
 *      const parsed2 = safeJsonParse<UserType>(toParse);
 *      //- runtime: { name: "John" } | undefined
 *      //- type: undefined  <- (⚠️ unexpected!)
 *      const parsed = safeJsonParse<UserType, typeof toParse>(toParse);
 *      //- runtime: { name: "John" } | null | undefined
 *      //- type: UserType | null | undefined
 *      const parsed2 = safeJsonParse<UserType, typeof toParse>(toParse);
 *      //- runtime: { name: "John" } | undefined
 *      //- type: UserType | undefined
 *  ```
 * @note
 * ⚠️ **Generic Behavior:**
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
  options?: ParseParsedDataOptions
): IsAny<TInput> extends true ? TData | null | undefined : undefined;
export function safeJsonParse<
  TData extends Record<string, any> = Record<string, unknown>,
  TInput extends string | null | undefined | unknown = undefined
>(value: TInput, options?: ParseParsedDataOptions): SafeJsonParseResult<TData, TInput>;
//! implement main function
export function safeJsonParse<TData extends Record<string, unknown>>(
  value: unknown,
  options: ParseParsedDataOptions = {}
) {
  if (isNull(value)) return null;
  const validOptions = validateOptions(options);

  if (
    validOptions.convertNaN &&
    (isNaN(value) || (isNonEmptyString(value) && value === "NaN"))
  ) {
    return NaN;
  }
  if (
    validOptions.convertNumbers &&
    !isNaN(Number(value)) &&
    isNumber(extractDigits(value))
  ) {
    return Number(value);
  }

  if (!isString(value)) return undefined;

  try {
    // First, normalize all single quotes to double quotes
    let normalized = fixSingleQuotesEscapeBackslash(value);

    if (validOptions.removeUndefined) {
      normalized = normalized
        .replace(/,\s*"[^"]*"\s*:\s*undefined(?=\s*[},])/g, "")
        // ➔ remove , "key": undefined
        .replace(/"[^"]*"\s*:\s*undefined\s*(,)?/g, "");
      // ➔ remove "key": undefined
    } else {
      normalized = normalized.replace(/:\s*undefined(?=\s*[,}])/g, ":null");
      // ➔ replace :undefined with :null
    }

    if (validOptions.convertNaN) {
      normalized = normalized.replace(/:\s*NaN(?=\s*[,}])/g, ':"NaN"');
      // ➔ convert :NaN to :"NaN"
    } else {
      normalized = normalized
        .replace(/:\s*NaN(?=\s*[,}])/g, ':"NaN"')
        // ➔ convert :NaN to :"NaN"
        .replace(/,\s*"[^"]*"\s*:\s*NaN(?=\s*[},])/g, "")
        // ➔ remove , "key": NaN
        .replace(/"[^"]*"\s*:\s*NaN\s*(,)?/g, "");
      // ➔ remove "key": NaN
    }

    normalized = normalized.replace(/,(\s*[}\]])/g, "$1");
    // ➔ remove trailing comma before } or ]

    const parsed = JSON.parse(normalized);
    return cleanParsedData<TData>(parsed, validOptions);
  } catch (error) {
    if (validOptions.loggingOnFail) {
      console.error("Failed to parsing at `safeJsonParse`:", error);
    }

    validOptions.onError(
      isError(error)
        ? new Error(error.message.replace(/^JSON\.parse:/, "Failed to parsing"))
        : new Error(String(error))
    );

    return undefined;
  }
}

function fixSingleQuotesEscapeBackslash(input: string): string {
  const validEscapes = new Set(["\\", '"', "/", "b", "f", "n", "r", "t", "u"]);

  let output = "";
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let escapeNext = false;

  for (let i = 0; i < input.length; i++) {
    const c = input[i];

    if (escapeNext) {
      if (inSingleQuote) {
        if (c === "'") {
          output += "'";
        } else if (validEscapes.has(c)) {
          if (c === "\\") {
            output += "\\\\";
          } else if (c === '"') {
            output += '\\"';
          } else {
            output += "\\" + c;
          }
        } else {
          output += "\\\\" + c;
        }
      } else if (inDoubleQuote) {
        if (c === '"') {
          output += '\\"';
        } else if (validEscapes.has(c)) {
          output += "\\" + c;
        } else {
          output += "\\\\" + c;
        }
      } else {
        output += "\\" + c;
      }
      escapeNext = false;
      continue;
    }

    if (c === "\\") {
      escapeNext = true;
      continue;
    }

    if (!inSingleQuote && !inDoubleQuote) {
      if (c === "'") {
        output += '"';
        inSingleQuote = true;
        continue;
      }
      if (c === '"') {
        output += '"';
        inDoubleQuote = true;
        continue;
      }
    } else if (inSingleQuote) {
      if (c === "'") {
        output += '"';
        inSingleQuote = false;
        continue;
      }
    } else if (inDoubleQuote) {
      if (c === '"') {
        output += '"';
        inDoubleQuote = false;
        continue;
      }
    }

    output += c;
  }

  return output;
}
