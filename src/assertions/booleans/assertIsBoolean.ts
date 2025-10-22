import { isBoolean } from "@/predicates/is/isBoolean";
import {
  type OptionsAssertIs,
  resolveErrorMessageAssertions
} from "../_private/assertIs";

/** -------------------------------------------------------
 * * ***Type guard assertion: `assertIsBoolean`.***
 * -------------------------------------------------------
 * **This function is an **assertion function**.**
 * - **Behavior:**
 *    - Validates that the given `value` is a **boolean**.
 *    - After it returns successfully, TypeScript narrows the type of `value` to `boolean`.
 *    - ✅ If `value` is a `boolean` ➔ execution continues normally.
 *    - ❌ If `value` is not a `boolean` ➔ throws a built-in error with either:
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
 * @param {*} value - ***The value to validate.***
 * @param {OptionsAssertIs} [options]
 *  ***Optional configuration:***
 *    - `message`: A custom error message (`string` or `function`).
 *    - `errorType`: A custom built-in JavaScript error type to throw.
 *    - `formatCase`: Controls type formatting (from `GetPreciseTypeOptions`).
 * @returns {boolean} Narrows `value` to `boolean` if no error is thrown.
 * @throws [`TypeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError) | [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [`EvalError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/EvalError) | [`RangeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError) | [`ReferenceError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError) | [`SyntaxError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError) | [`URIError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/URIError) if the value is not a boolean.
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
 * // ❌ Throws RangeError instead of TypeError
 * assertIsBoolean(42, { errorType: "RangeError" });
 * // ➔ RangeError: "Parameter input (`value`) must be of type `boolean`, but received: `number`."
 *
 * // ❌ Throws with custom function message + case formatting
 * assertIsBoolean(123n, {
 *   message: ({ currentType, validType }) => `Expected ${validType} but got (${currentType}).`,
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
 * // ⚠️ Code below after this call, will NOT be executed if the error is thrown
 * assertIsBoolean(mixedValue, { message: "Must be boolean!", errorType: "RangeError" });
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

  resolveErrorMessageAssertions({
    value,
    options,
    requiredValidType: "boolean"
  });
};
