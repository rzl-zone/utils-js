import { isBoolean } from "@/predicates/is/isBoolean";
import {
  type OptionsAssertIs,
  resolveErrorMessageAssertions
} from "../_private/assertIs";

/** -------------------------------------------------------
 * * ***Type guard assertion: `assertIsBoolean`.***
 * -------------------------------------------------------
 * **This function is an **assertion function**.**
 *  - Validates that the given `value` is a **boolean**.
 *  - After it returns successfully, TypeScript narrows the type of `value` to `boolean`.
 * - **Behavior:**
 *   - ✅ If `value` is a `boolean` ➔ execution continues normally.
 *   - ❌ If `value` is not a `boolean` ➔ throws a `TypeError` with either:
 *     - A custom error message (`options.message`), or
 *     - A default message including the actual type.
 * @param {*} value - The value to validate.
 * @param {OptionsAssertIs} [options] - Optional configuration:
 *   - `message`: A custom error message (`string` or `function`).
 *   - `formatCase`: Controls type formatting (from `GetPreciseTypeOptions`).
 * @returns {boolean} Narrows `value` to `boolean` if no error is thrown.
 * @throws {TypeError} If the value is not a boolean.
 * @example
 * ```ts
 * // ✅ Simple usage
 * assertIsBoolean(true);
 * // No error, value is boolean
 *
 * // ❌ Throws TypeError with default message
 * assertIsBoolean(42);
 * // ➔ TypeError: "Parameter input (`value`) must be of type `boolean`, but received: `number`."
 *
 * // ❌ Throws with custom string message
 * assertIsBoolean(42, { message: "Must be boolean!" });
 * // ➔ TypeError: "Must be boolean!"
 *
 * // ❌ Throws with custom function message + case formatting
 * assertIsBoolean(123n, {
 *   message: ({ currentType, validType }) =>
 *     `Expected ${validType} but got (${currentType}).`,
 *   formatCase: "toKebabCase"
 * });
 * // ➔ TypeError: "Expected boolean but got (big-int)."
 * ```
 * -------------------------------------------------------
 * ✅ ***Real-world usage example***:
 * ```ts
 * type User = { name: string; email: string };
 * const mixedValue: string | User | boolean | number | undefined = getUserInput();
 *
 * // ❌ Throws if not boolean
 * // ⚠️ Code below after this call, will NOT be executed if TypeError is thrown
 * assertIsBoolean(mixedValue, { message: "Must be boolean!" });
 *
 * // ✅ After this call, TypeScript knows `mixedValue` is boolean
 * const result: boolean = mixedValue; // ➔ Safe to use
 * ```
 */
export const assertIsBoolean: (
  value: unknown,
  options?: OptionsAssertIs
) => asserts value is boolean = (
  value: unknown,
  options: OptionsAssertIs = {}
): asserts value is boolean => {
  if (isBoolean(value)) return;

  const errorMessage = resolveErrorMessageAssertions({
    value,
    options,
    requiredValidType: "boolean"
  });

  throw new TypeError(errorMessage);
};
