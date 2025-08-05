import { isArray, isEmptyString, isNil, isObject, isString } from "./";

/** ----------------------------------------------------------
 * * ***Determines if a value is an empty object (`{}`), empty array (`[]`), or generally falsy.***
 * ----------------------------------------------------------
 *
 * - Returns `true` for `{}`, `[]`, `null`, `undefined`, `""`, `false`, and `NaN`.
 * - Returns `false` for objects with properties, non-empty arrays, numbers, functions, and other non-empty values.
 * - Safely handles `null`, `undefined`, and non-object types without throwing.
 *
 * @param {unknown} value - The value to evaluate.
 * @returns {boolean} `true` if the value is considered empty, otherwise `false`.
 *
 * @example
 * isEmptyValue({}); // true
 * isEmptyValue([]); // true
 * isEmptyValue({ key: "value" }); // false
 * isEmptyValue([1, 2, 3]); // false
 * isEmptyValue(null); // true
 * isEmptyValue(undefined); // true
 * isEmptyValue(""); // true
 * isEmptyValue("   "); // true
 * isEmptyValue(0); // false
 * isEmptyValue(-1); // false
 * isEmptyValue(2); // false
 * isEmptyValue(() => {}); // false
 */
export const isEmptyValue = (value: unknown): boolean => {
  if (isNil(value) || value === false) return true;
  if (typeof value === "number" && Number.isNaN(value)) return true;
  if (isString(value)) return isEmptyString(value);
  if (isArray(value)) return value.length === 0;

  if (isObject(value)) {
    return (
      Object.keys(value).length === 0 &&
      Object.getOwnPropertySymbols(value).length === 0
    );
  }

  return false;
};
