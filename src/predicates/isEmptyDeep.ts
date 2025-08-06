import {
  isArray,
  isEmptyArray,
  isEmptyString,
  isNumber,
  isObject,
  isObjectOrArray,
  isString,
} from "./";

/** ----------------------------------------------------------
 * * ***Recursively checks if a value is "deeply empty".***
 * ----------------------------------------------------------
 *
 * - Returns `true` for:
 *   - Empty objects: `{}`
 *   - Empty arrays: `[]`
 *   - Nested empty structures: `{ a: [], b: {} }`
 *   - Falsy values (except numbers): `null`, `undefined`, `false`, `""`, `NaN`
 *
 * - Returns `false` for:
 *   - Non-zero numbers
 *   - Objects or arrays containing non-empty values
 *   - Non-empty strings, `true`, functions, symbols, etc.
 *
 * @param {unknown} value - The value to deeply check.
 * @returns {boolean} `true` if the value is deeply empty, otherwise `false`.
 *
 * @example
 * isEmptyDeep({}); // true
 * isEmptyDeep([]); // true
 * isEmptyDeep({ a: {} }); // true
 * isEmptyDeep([[], {}]); // true
 * isEmptyDeep({ a: [1] }); // false
 * isEmptyDeep([0]); // false
 * isEmptyDeep("test"); // false
 * isEmptyDeep(""); // true
 * isEmptyDeep(0); // false
 * isEmptyDeep(NaN); // true
 */
export const isEmptyDeep = (value: unknown): boolean => {
  if (isString(value)) return isEmptyString(value);
  if (isNumber(value)) return false;
  if (isArray(value)) {
    return isEmptyArray(value) || value.every(isEmptyDeep);
  }
  if (isObjectOrArray(value)) {
    const keys = Object.keys(value);
    const symbols = Object.getOwnPropertySymbols(value);
    return (
      [...keys, ...symbols].length === 0 ||
      [...keys, ...symbols].every((key) =>
        isObject(value) && isString(key) ? isEmptyDeep(value[key]) : key
      )
    );
  }
  if (!value) return true;

  return false;
};
