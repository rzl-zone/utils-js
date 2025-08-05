import {
  isArray,
  isBoolean,
  isEmptyString,
  isEmptyValue,
  isNil,
  isNumber,
  isObject,
  isString,
} from "@/index";

/** ---------------------------------
 * * ***Converts a given value into a boolean (strict).***
 * ---------------------------------
 *
 * This is stricter than normal JS coercion:
 * - `null` and `undefined` return `false`.
 * - Empty strings return `false`, non-empty strings return `true`.
 * - Numbers: `0` is `false`, others `true`.
 * - Booleans returned as-is.
 * - Arrays: `[]` is `false`, non-empty is `true`.
 * - Objects: `{}` is `false`, object with keys is `true`.
 *
 * @param {unknown} [value] - The value to be converted.
 * @returns {boolean} `true` if the value is considered non-empty, otherwise `false`.
 *
 * @example
 * toBooleanContent(null);      // false
 * toBooleanContent("");        // false
 * toBooleanContent("  ");        // false
 * toBooleanContent(" asd ");        // true
 * toBooleanContent("abc");     // true
 * toBooleanContent(0);         // false
 * toBooleanContent(42);        // true
 * toBooleanContent([]);        // false
 * toBooleanContent([1]);       // true
 * toBooleanContent({});        // false
 * toBooleanContent({ a: 1 });  // true
 */
export const toBooleanContent = (value?: unknown): boolean => {
  if (isNil(value)) return false;
  if (isString(value)) return !isEmptyString(value); // or value.trim().length > 0;
  if (isBoolean(value)) return value;
  if (isNumber(value)) return value !== 0;
  if (isArray(value) || isObject(value)) {
    return !isEmptyValue(value);
  }
  return Boolean(value);
};

// /** * ***DEPRECATED***
//  * ---------------------------------
//  * @deprecated This function will remove at next version. Use `toBooleanContent` instead.
//  */
// export const convertToBooleanStrict = toBooleanContent;
