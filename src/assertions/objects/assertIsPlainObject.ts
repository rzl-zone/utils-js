import { isPlainObject, type IsPlainObjectResult } from "@/predicates/is/isPlainObject";
import {
  type OptionsAssertIs,
  resolveErrorMessageAssertions
} from "../_private/assertIs";

/** -------------------------------------------------------
 * * ***Type guard assertion: `assertIsPlainObject`.***
 * -------------------------------------------------------
 * **This function is an **assertion function**.**
 * - Validates that the given `value` is a **plain-object**.
 * - After it returns successfully, TypeScript narrows the type of `value` to `plain-object` **(generic support)**.
 * - **Behavior:**
 *    - ✅ If `value` is a `plain-object` ➔ execution continues normally.
 *    - ❌ If `value` is not a `plain-object` ➔ throws a `TypeError` with either:
 *      - A custom error message (`options.message`), or
 *      - A default message including the actual type.
 * @template T - The input type being asserted.
 * @param {*} value - The value to validate.
 * @param {OptionsAssertIs} [options] - Optional configuration:
 *   - `message`: A custom error message (`string` or `function`).
 *   - `formatCase`: Controls type formatting (from `GetPreciseTypeOptions`).
 * @returns {boolean} Narrows `value` to a `plain-object` **(generic support)** if no error is thrown.
 * @throws {TypeError} If `value` is not a `plain-object`.
 * @example
 * ```ts
 * // ✅ Simple usage
 * assertIsPlainObject({ a: 1, b: 2 });
 * // ➔ ok, value is plain object
 *
 * // ❌ Throws TypeError with default message
 * assertIsPlainObject([1, 2, 3]);
 * // ➔ TypeError: "Parameter input (`value`) must be of type `plain-object`, but received: `array`."
 *
 * // ❌ Throws with custom string message
 * assertIsPlainObject("hello", { message: "Must be plain object!" });
 * // ➔ TypeError: "Must be plain object!"
 *
 * // ❌ Throws with custom message function and formatCase
 * assertIsPlainObject(42n, {
 *   message: ({ currentType, validType }) =>
 *     `Expected ${validType} but got (${currentType}).`,
 *   formatCase: "toKebabCase"
 * });
 * // ➔ TypeError: "Expected plain-object but got (big-int)."
 * ```
 * -------------------------------------------------------
 * ✅ ***Real-world usage with generic narrowing***:
 * ```ts
 * type User = { name: string; email: string };
 * const mixedValue: string | User | boolean | number | undefined = getUserInput();
 *
 * // Throws TypeError if not plain object
 * assertIsPlainObject(mixedValue, { message: "Must be plain object!" });
 *
 * // After this call, TypeScript knows `mixedValue` is narrowed to User
 * const user: User = mixedValue; // ➔ safe
 * console.log(user.email);       // ➔ type-safe
 * ```
 */
export function assertIsPlainObject<T>(
  value: T,
  options: OptionsAssertIs = {}
): asserts value is IsPlainObjectResult<T> {
  if (isPlainObject(value)) return;

  const errorMessage = resolveErrorMessageAssertions({
    value,
    options,
    requiredValidType: "plain object"
  });

  throw new TypeError(errorMessage);
}
