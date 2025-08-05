import {
  isArray,
  isEmptyArray,
  isEmptyString,
  isNumber,
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
  if (!value) return true;

  if (isArray(value)) {
    return isEmptyArray(value) || value.every(isEmptyDeep);
  }

  if (isObjectOrArray(value)) {
    const keys = Object.keys(value);
    const symbols = Object.getOwnPropertySymbols(value);
    return (
      [...keys, ...symbols].length === 0 ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [...keys, ...symbols].every((key) => isEmptyDeep((value as any)[key]))
    );
  }

  return false;
};
