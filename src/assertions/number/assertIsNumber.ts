import { isNumber, type IsNumberOptions } from "@/predicates/is/isNumber";

import {
  resolveErrorMessageAssertions,
  type OptionsAssertIs
} from "../_private/assertIs";
import { hasOwnProp } from "@/predicates/has/hasOwnProp";

type OptionsAssertIsNumber = OptionsAssertIs & IsNumberOptions;

/** -------------------------------------------------------
 * * ***Type guard assertion: `assertIsNumber`.***
 * -------------------------------------------------------
 * **This function is an **assertion function**.**
 * - **Behavior:**
 *    - Validates that the given `value` is a **number**.
 *    - After it returns successfully, TypeScript narrows the type of `value` to `number`.
 *    - ✅ If `value` is a `number` ➔ execution continues normally.
 *    - ❌ If `value` is not a `number` ➔ throws a `TypeError` with either:
 *      - A custom error message (`options.message`), or
 *      - A default message including the actual type.
 * - **ℹ️ Note:**
 *    - A `number` refers strictly to the JavaScript `number` primitive type (e.g., `42`, `3.14`, `-1`, `0`).
 *    - This excludes `Number` objects created with `new Number(123)`.
 *    - By default, `NaN` is **not considered** valid, you can allow it with `{ includeNaN: true }`.
 * @param {*} value - ***The value to validate.***
 * @param {OptionsAssertIsNumber} [options]
 *  ***Optional configuration:***
 *   - `message`: A custom error message (`string` or `function`).
 *   - `formatCase`: Controls type formatting (from `GetPreciseTypeOptions`).
 *   - `includeNaN`: Whether to treat `NaN` as valid.
 * @returns {boolean} Narrows `value` to `number` if no error is thrown.
 * @throws {TypeError} If the value is not a number (or is `NaN` when `includeNaN` is `false`).
 * @example
 * ```ts
 * // ✅ Simple usage
 * assertIsNumber(123);
 * // No error, value is number
 *
 * // ❌ Throws TypeError with default message
 * assertIsNumber("42");
 * // ➔ TypeError: "Parameter input (`value`) must be of type `number`, but received: `string`."
 *
 * // ❌ Throws with custom string message
 * assertIsNumber(true, { message: "Must be a number!" });
 * // ➔ TypeError: "Must be a number!"
 *
 * // ❌ Throws with custom function message + case formatting
 * assertIsNumber("hello", {
 *   message: ({ currentType, validType }) => {
 *     return `Expected ${validType} but got (${currentType}).`;
 *   },
 *   formatCase: "toKebabCase"
 * });
 * // ➔ TypeError: "Expected number but got (string)."
 *
 * // ⚠️ NaN is invalid by default
 * assertIsNumber(NaN);
 * // ➔ TypeError: "Parameter input (`value`) must be of type `number`, but received: `NaN`."
 *
 * // ✅ Allow NaN explicitly
 * assertIsNumber(NaN, { includeNaN: true });
 * // No error
 * ```
 *
 * -------------------------------------------------------
 * ✅ ***Real-world usage example***:
 * ```ts
 * const mixedValue: string | number | undefined = getUserInput();
 *
 * // ❌ Throws if not number
 * // ⚠️ Code below after this call, will NOT be executed if TypeError is thrown
 * assertIsNumber(mixedValue, { message: "Must be a number!" });
 *
 * // ✅ After this call, TypeScript knows `mixedValue` is number
 * const result: number = mixedValue; // ➔ Safe to use
 * console.log(result + 100);
 * ```
 */
export const assertIsNumber: (
  value: unknown,
  options?: OptionsAssertIsNumber
) => asserts value is number = (
  value: unknown,
  options: OptionsAssertIsNumber = {}
): asserts value is number => {
  const includeNaN = hasOwnProp(options, "includeNaN") ? options.includeNaN : undefined;

  if (isNumber(value, { includeNaN })) return;

  const errorMessage = resolveErrorMessageAssertions({
    value,
    options,
    requiredValidType: "number"
  });

  throw new TypeError(errorMessage);
};
