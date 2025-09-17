import { isString } from "@/predicates/is/isString";
import {
  resolveErrorMessageAssertions,
  type OptionsAssertIs
} from "../_private/assertIs";

/** -------------------------------------------------------
 * * ***Type guard assertion: `assertIsString`.***
 * -------------------------------------------------------
 * **This function is an **assertion function**.**
 * - **Behavior:**
 *    - Validates that the given `value` is a **primitive-string**.
 *    - After it returns successfully, TypeScript narrows the type of `value` to `primitive-string`.
 *    - ✅ If `value` is a `primitive-string` ➔ execution continues normally.
 *    - ❌ If `value` is not a `primitive-string` ➔ throws a `TypeError` with either:
 *      - A custom error message (`options.message`), or
 *      - A default message including the actual type.
 * - **ℹ️ Note:**
 *    - A "string" refers strictly to a JavaScript `primitive-string` type (e.g., `"hello"`, `""`, `"123"`).
 *    - This function excludes `String` objects created with `new String()`.
 * @param {*} value - ***The value to validate.***
 * @param {OptionsAssertIs} [options]
 *  ***Optional configuration:***
 *   - `message`: A custom error message (`string` or `function`).
 *   - `formatCase`: Controls type formatting (from `GetPreciseTypeOptions`).
 * @returns {boolean} Narrows `value` to `string` if no error is thrown.
 * @throws {TypeError} If the value is not a string.
 * @example
 * ```ts
 * // ✅ Simple usage
 * assertIsString("hello");
 * // ➔ ✅ ok value is string, no error
 *
 * // ❌ Throws TypeError with default message
 * assertIsString(42);
 * // ➔ TypeError: "Parameter input (`value`) must be of type `string`, but received: `number`."
 *
 * // ❌ Throws with custom string message
 * assertIsString(42, { message: "Must be a string!" });
 * // ➔ TypeError: "Must be a string!"
 *
 * // ❌ Throws with custom message function and formatCase
 * assertIsString(42n, {
 *   message: ({ currentType, validType }) => {
 *     return `Expected ${validType} but got (${currentType}).`;
 *   },
 *   formatCase: "toKebabCase"
 * });
 * // ➔ TypeError: "Expected string but got (big-int)."
 * ```
 * -------------------------------------------------------
 * ✅ ***Real-world usage with generic narrowing***:
 * ```ts
 * type User = { name: string; email: string };
 * const mixedValue: string | User | undefined = getUserInput();
 *
 * // Throws TypeError if the value is not string
 * // ⚠️ Code below after this call, will NOT be executed if TypeError is thrown
 * assertIsString(mixedValue, { message: "Must be a string!" });
 *
 * // After this call, TypeScript knows `mixedValue` is string
 * const result: string = mixedValue; // ➔ ✅ safe to use
 * console.log(result.toUpperCase()); // ➔ ✅ type-safe
 * ```
 */
export const assertIsString: (
  value: unknown,
  options?: OptionsAssertIs
) => asserts value is string = (
  value: unknown,
  options: OptionsAssertIs = {}
): asserts value is string => {
  if (isString(value)) return;

  const errorMessage = resolveErrorMessageAssertions({
    value,
    options,
    requiredValidType: "string"
  });

  throw new TypeError(errorMessage);
};
