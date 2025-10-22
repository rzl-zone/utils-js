import { isBigInt } from "@/predicates/is/isBigInt";

import {
  resolveErrorMessageAssertions,
  type OptionsAssertIs
} from "../_private/assertIs";

/** -------------------------------------------------------
 * * ***Type guard assertion: `assertIsBigInt`.***
 * -------------------------------------------------------
 * **This function is an **assertion function**.**
 * - **Behavior:**
 *    - Validates that the given `value` is a **bigint**.
 *    - After it returns successfully, TypeScript narrows the type of `value` to `bigint`.
 *    - ✅ If `value` is a `bigint` ➔ execution continues normally.
 *    - ❌ If `value` is not a `bigint` ➔ throws a built-in error with either:
 *      - A custom error message (`options.message`), or
 *      - A default message including the actual type.
 *  - **ℹ️ Note:**
 *    - A `bigint` refers strictly to the JavaScript `bigint` primitive type (e.g., `123n`, `0n`, `-999999999999999999999n`).
 *    - This excludes `BigInt` objects created with `Object(BigInt(123))`.
 *  - **⚠️ Error type selection (`options.errorType`):**
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
 * @returns {boolean} Narrows `value` to `bigint` if no error is thrown.
 * @throws [`TypeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError) | [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [`EvalError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/EvalError) | [`RangeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError) | [`ReferenceError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError) | [`SyntaxError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError) | [`URIError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/URIError) if the value is not a bigint.
 * @example
 * ```ts
 * // ✅ Simple usage
 * assertIsBigInt(123n);
 * // No error, value is bigint
 *
 * // ❌ Throws TypeError with default message
 * assertIsBigInt(42);
 * // ➔ TypeError: "Parameter input (`value`) must be of type `bigint`, but received: `number`."
 *
 * // ❌ Throws with custom string message
 * assertIsBigInt("123", { message: "Must be a bigint!" });
 * // ➔ TypeError: "Must be a bigint!"
 *
 * // ❌ Throws with custom function message + case formatting
 * assertIsBigInt(42, {
 *   message: ({ currentType, validType }) => `Expected ${validType} but got (${currentType}).`,
 *   formatCase: "toKebabCase"
 * });
 * // ➔ TypeError: "Expected bigint but got (number)."
 *
 * // ❌ Throws with custom function message + formatCase showing big-int
 * assertIsBigInt(123, {
 *   message: ({ currentType, validType }) => `Expected ${validType} but got (${currentType}).`,
 *   formatCase: "toKebabCase"
 * });
 * // ➔ TypeError: "Expected bigint but got (number)."
 *
 * // ❌ Throws custom error type (e.g., RangeError)
 * assertIsBigInt(42, { errorType: "RangeError" });
 * // ➔ RangeError: "Parameter input (`value`) must be of type `bigint`, but received: `number`."
 * ```
 * -------------------------------------------------------
 * ✅ ***Real-world usage example***:
 * ```ts
 * const mixedValue: string | bigint | undefined = getUserInput();
 *
 * // ❌ Throws if not bigint
 * assertIsBigInt(mixedValue, { message: "Must be a bigint!", errorType: "TypeError" });
 *
 * // ✅ After this call, TypeScript knows `mixedValue` is bigint
 * const result: bigint = mixedValue;
 * console.log(result + 100n);
 * ```
 */
export const assertIsBigInt: (
  value: unknown,
  options?: OptionsAssertIs
) => asserts value is bigint = (
  value: unknown,
  options: OptionsAssertIs = {}
): asserts value is bigint => {
  if (isBigInt(value)) return;

  resolveErrorMessageAssertions({
    value,
    options,
    requiredValidType: "big int"
  });
};
