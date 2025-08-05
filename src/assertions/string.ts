import { isFunction } from "@/predicates";
import { isString } from "@/index";

/** -------------------------------------------------------
 * * ***Asserts that a value is of type `string`.***
 * -------------------------------------------------------
 *
 * Throws a `TypeError` if the value is not a string.
 *
 * @param {unknown} value - The value to check.
 * @param {string | ((actualType: string) => string)} [message]
 *        Optional custom error message. If a function is provided,
 *        it receives the actual type (e.g. "number") and should return a string message.
 * @returns {asserts value is string} Ensures `value` is `string` after this call.
 *
 * @throws {TypeError} If the value is not a string.
 *
 * @example
 * assertIsString("hello"); // ✅ ok
 *
 * @example
 * assertIsString(42); // ❌ throws TypeError: Expected value to be 'string', but got 'number'
 *
 * @example
 * assertIsString(42, "Must be a string!"); // ❌ throws: Must be a string!
 *
 * @example
 * assertIsString(42, (type) => `Expected string but got ${type}`); // ❌ throws: Expected string but got number
 */
export const assertIsString: (
  value: unknown,
  message?: string | ((typeValue: string) => string)
) => asserts value is string = (
  value: unknown,
  message?: string | ((actualType: string) => string)
): asserts value is string => {
  if (!isString(value)) {
    const actualType = typeof value;

    throw new TypeError(
      isFunction(message)
        ? message(actualType)
        : message?.trim() ||
          `Expected value to be 'string', but got '${actualType}'`
    );
  }
};
