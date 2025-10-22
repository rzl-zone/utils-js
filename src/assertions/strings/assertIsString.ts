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
 *    - ❌ If `value` is not a `primitive-string` ➔ throws a built-in error with either:
 *      - A custom error message (`options.message`), or
 *      - A default message including the actual type.
 * - **ℹ️ Note:**
 *    - A "string" refers strictly to a JavaScript `primitive-string` type (e.g., `"hello"`, `""`, `"123"`).
 *    - This function excludes `String` objects created with `new String()`.
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
 * @param {*} value - ***The value to validate.***
 * @param {OptionsAssertIs} [options]
 *  ***Optional configuration:***
 *   - `message`: A custom error message (`string` or `function`).
 *   - `errorType`: Built-in JavaScript error type to throw on failure (default `"TypeError"`).
 *   - `formatCase`: Controls type formatting (from `GetPreciseTypeOptions`).
 * @returns {boolean} Narrows `value` to `string` if no error is thrown.
 * @throws [`TypeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError) | [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [`EvalError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/EvalError) | [`RangeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError) | [`ReferenceError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError) | [`SyntaxError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError) | [`URIError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/URIError) if the value is not a primitive string.
 * @example
 * ```ts
 * // ✅ Simple usage
 * assertIsString("hello");
 * // ➔ ok value is string, no error
 *
 * // ❌ Throws TypeError with default message
 * assertIsString(42);
 * // ➔ TypeError: "Parameter input (`value`) must be of type `string`, but received: `number`."
 *
 * // ❌ Throws with custom string message
 * assertIsString(42, { message: "Must be a string!" });
 * // ➔ TypeError: "Must be a string!"
 *
 * // ❌ Throws RangeError instead of TypeError
 * assertIsString(42, { errorType: "RangeError" });
 * // ➔ RangeError: "Parameter input (`value`) must be of type `string`, but received: `number`."
 *
 * // ❌ Throws with custom message function + case formatting
 * assertIsString(42n, {
 *   message: ({ currentType, validType }) => `Expected ${validType} but got (${currentType}).`,
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
 * // ❌ Throws if the value is not string
 * assertIsString(mixedValue, { message: "Must be a string!", errorType: "RangeError" });
 *
 * // ✅ After this call, TypeScript knows `mixedValue` is string
 * const result: string = mixedValue; // ➔ safe
 * console.log(result.toUpperCase()); // ➔ type-safe
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

  resolveErrorMessageAssertions({
    value,
    options,
    requiredValidType: "string"
  });
};
