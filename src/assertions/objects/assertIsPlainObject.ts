import { isPlainObject, type IsPlainObjectResult } from "@/predicates/is/isPlainObject";
import {
  type OptionsAssertIs,
  resolveErrorMessageAssertions
} from "../_private/assertIs";

/** -------------------------------------------------------
 * * ***Type guard assertion: `assertIsPlainObject`.***
 * -------------------------------------------------------
 * **This function is an **assertion function**.**
 * - **Behavior:**
 *    - Validates that the given `value` is a **plain-object**.
 *    - After it returns successfully, TypeScript narrows the type of `value` to `plain-object` **(generic support)**.
 *    - ✅ If `value` is a `plain-object` ➔ execution continues normally.
 *    - ❌ If `value` is not a `plain-object` ➔ throws a built-in error with either:
 *      - A custom error message (`options.message`), or
 *      - A default message including the actual type.
 * - **⚠️ Error type selection (`options.errorType`):**
 *    - You can override the type of error thrown when validation fails.
 *    - Must be one of the standard JavaScript built-in errors:
 *      - [`TypeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError) |
 *        [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) |
 *        [`EvalError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/EvalError) |
 *        [`RangeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError) |
 *        [`ReferenceError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError) |
 *        [`SyntaxError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError) |
 *        [`URIError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/URIError)
 *    - **Default:** `"TypeError"` if not provided or invalid.
 * @template T - The input type being asserted.
 * @param {*} value - ***The value to validate.***
 * @param {OptionsAssertIs} [options]
 *  ***Optional configuration:***
 *   - `message`: A custom error message (`string` or `function`).
 *   - `errorType`: Built-in JavaScript error type to throw on failure (default `"TypeError"`).
 *   - `formatCase`: Controls type formatting (from `GetPreciseTypeOptions`).
 * @returns {boolean} Narrows `value` to a `plain-object` **(generic support)** if no error is thrown.
 * @throws [`TypeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError) | [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [`EvalError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/EvalError) | [`RangeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError) | [`ReferenceError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError) | [`SyntaxError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError) | [`URIError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/URIError) if `value` is not a plain-object.
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
 * // ❌ Throws RangeError instead of TypeError
 * assertIsPlainObject(42, { errorType: "RangeError" });
 * // ➔ RangeError: "Parameter input (`value`) must be of type `plain-object`, but received: `number`."
 *
 * // ❌ Throws with custom message function + case formatting
 * assertIsPlainObject(42n, {
 *   message: ({ currentType, validType }) => `Expected ${validType} but got (${currentType}).`,
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
 * // ❌ Throws if not plain object
 * assertIsPlainObject(mixedValue, { message: "Must be plain object!", errorType: "RangeError" });
 *
 * // ✅ After this call, TypeScript knows `mixedValue` is narrowed to User
 * const user: User = mixedValue; // ➔ safe
 * console.log(user.email);       // ➔ type-safe
 * ```
 */
export function assertIsPlainObject<T>(
  value: T,
  options: OptionsAssertIs = {}
): asserts value is IsPlainObjectResult<T> {
  if (isPlainObject(value)) return;

  resolveErrorMessageAssertions({
    value,
    options,
    requiredValidType: "plain object"
  });
}
