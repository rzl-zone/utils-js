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
 *    - ❌ If `value` is not a `bigint` ➔ throws a `TypeError` with either:
 *      - A custom error message (`options.message`), or
 *      - A default message including the actual type.
 *  - **ℹ️ Note:**
 *    - A `bigint` refers strictly to the JavaScript `bigint` primitive type (e.g., `123n`, `0n`, `-999999999999999999999n`).
 *    - This excludes `BigInt` objects created with `Object(BigInt(123))`.
 * @param {*} value - ***The value to validate.***
 * @param {OptionsAssertIs} [options]
 *  ***Optional configuration:***
 *   - `message`: A custom error message (`string` or `function`).
 *   - `formatCase`: Controls type formatting (from `GetPreciseTypeOptions`).
 * @returns {boolean} Narrows `value` to `bigint` if no error is thrown.
 * @throws **{@link TypeError | `TypeError`}** if the value is not a bigint.
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
 *   message: ({ currentType, validType }) => {
 *     return `Expected ${validType} but got (${currentType}).`;
 *   },
 *   formatCase: "toKebabCase"
 * });
 * // ➔ TypeError: "Expected bigint but got (number)."
 * ```
 * -------------------------------------------------------
 * ✅ ***Real-world usage example***:
 * ```ts
 * const mixedValue: string | bigint | undefined = getUserInput();
 *
 * // ❌ Throws if not bigint
 * // ⚠️ Code below after this call, will NOT be executed if TypeError is thrown
 * assertIsBigInt(mixedValue, { message: "Must be a bigint!" });
 *
 * // ✅ After this call, TypeScript knows `mixedValue` is bigint
 * const result: bigint = mixedValue; // ➔ Safe to use
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

  const errorMessage = resolveErrorMessageAssertions({
    value,
    options,
    requiredValidType: "big int"
  });

  throw new TypeError(errorMessage);
};
