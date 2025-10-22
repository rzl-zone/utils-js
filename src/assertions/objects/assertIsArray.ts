import type { IsArray, IsReadonlyArray, IsUnknown } from "@rzl-zone/ts-types-plus";

import { isArray } from "@/predicates/is/isArray";
import {
  resolveErrorMessageAssertions,
  type OptionsAssertIs
} from "../_private/assertIs";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type AssertIsArrayResult<T> = IsUnknown<T> extends true
  ? unknown[] & T
  : IsReadonlyArray<T> extends true
  ? T
  : T extends []
  ? T
  : IsArray<T> extends true
  ? T
  : Extract<T, unknown[] | [] | readonly []>;

/** -------------------------------------------------------
 * * ***Type guard assertion: `assertIsArray`.***
 * -------------------------------------------------------
 * **This function is an **assertion function**.**
 * - **Behavior:**
 *    - Validates that the given `value` is an **array**.
 *    - After it returns successfully, TypeScript narrows the type of `value` to `array` **(generic support)**.
 *    - ✅ If `value` is an `array` ➔ execution continues normally.
 *    - ❌ If `value` is not an `array` ➔ throws a built-in error with either:
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
 * @returns {boolean} Narrows `value` to an `array` **(generic support)** if no error is thrown.
 * @throws [`TypeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError) | [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [`EvalError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/EvalError) | [`RangeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError) | [`ReferenceError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError) | [`SyntaxError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError) | [`URIError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/URIError) if the value is not an array.
 * @example
 * ```ts
 * // ✅ Simple usage
 * assertIsArray([1, 2, 3]);
 * // No error, value is array
 *
 * // ❌ Throws TypeError with default message
 * assertIsArray({ a: 1 });
 * // ➔ TypeError: "Parameter input (`value`) must be of type `array`, but received: `plain-object`."
 *
 * // ❌ Throws with custom string message
 * assertIsArray(42, { message: "Must be an array!" });
 * // ➔ TypeError: "Must be an array!"
 *
 * // ❌ Throws RangeError instead of TypeError
 * assertIsArray(42, { errorType: "RangeError" });
 * // ➔ RangeError: "Parameter input (`value`) must be of type `array`, but received: `number`."
 *
 * // ❌ Throws with custom function message + case formatting
 * assertIsArray(42n, {
 *   message: ({ currentType, validType }) => `Expected ${validType} but got (${currentType}).`,
 *   formatCase: "toKebabCase"
 * });
 * // ➔ TypeError: "Expected array but got (big-int)."
 * ```
 * -------------------------------------------------------
 * ✅ ***Real-world usage with generic narrowing***:
 * ```ts
 * const mixedValue: string | number[] | undefined = getUserInput();
 *
 * // ❌ Throws if not array
 * assertIsArray(mixedValue, { message: "Must be an array!", errorType: "RangeError" });
 *
 * // ✅ After this call, TypeScript knows `mixedValue` is narrowed to number[]
 * const result: number[] = mixedValue; // ➔ Safe to use
 * console.log(result.length);
 * ```
 */
export function assertIsArray<T extends unknown[]>(
  value: T,
  options?: OptionsAssertIs
): value is Extract<T, unknown[]>;
export function assertIsArray<T extends readonly unknown[]>(
  value: T,
  options?: OptionsAssertIs
): value is Extract<T, readonly unknown[]>;
export function assertIsArray(
  value: unknown,
  options?: OptionsAssertIs
): value is unknown[];
export function assertIsArray<T>(value: T, options?: OptionsAssertIs): unknown {
  if (isArray(value)) return;

  resolveErrorMessageAssertions({
    value,
    options,
    requiredValidType: "array"
  });
}
