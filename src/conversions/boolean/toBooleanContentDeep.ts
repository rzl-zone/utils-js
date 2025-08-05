import {
  isArray,
  isBoolean,
  isEmptyString,
  isNil,
  isNumber,
  isObject,
  isString,
} from "@/index";

/** -------------------------------------------------
 * * ***Recursively checks if value is "non-empty".***
 * -------------------------------------------------
 *
 * This function does a deep inspection to determine if the input
 * contains any meaningful / non-empty value. It is stricter than
 * JavaScript's normal truthy checks because it looks *inside*
 * nested arrays & objects.
 *
 * Rules:
 * - `null` and `undefined` return `false`
 * - Empty strings `""` return `false`
 * - `0` returns `false`
 * - Empty arrays `[]` or empty objects `{}` return `false`
 * - Checks deeply nested arrays/objects — if any value inside is "non-empty", returns `true`
 *
 * @param {unknown} [value] - The value to check.
 * @returns {boolean} `true` if the value or anything nested inside is non-empty, otherwise `false`.
 *
 * @example
 * toBooleanContentDeep(null);          // false
 * toBooleanContentDeep("");            // false
 * toBooleanContentDeep(0);             // false
 * toBooleanContentDeep([]);            // false
 * toBooleanContentDeep({});            // false
 * toBooleanContentDeep([[], {}]);      // false
 *
 * toBooleanContentDeep("abc");         // true
 * toBooleanContentDeep(42);            // true
 * toBooleanContentDeep([0, "", null]); // false
 * toBooleanContentDeep([0, "", 5]);    // true
 * toBooleanContentDeep({ a: 0 });      // false
 * toBooleanContentDeep({ a: 1 });      // true
 * toBooleanContentDeep({ a: { b: [] }}); // false
 * toBooleanContentDeep({ a: { b: "x" }}); // true
 */
export const toBooleanContentDeep = (value?: unknown): boolean => {
  if (isNil(value)) return false;
  if (isString(value)) return !isEmptyString(value);
  if (isBoolean(value)) return value;
  if (isNumber(value)) return value !== 0;

  if (isArray(value)) {
    return value.some((item) => toBooleanContentDeep(item));
  }

  if (isObject(value)) {
    return Object.values(value).some((val) => toBooleanContentDeep(val));
  }

  return false;
};
