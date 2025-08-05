import { isNil } from "@/index";

/** ---------------------------------------------------------
 * * ***Type guard: Checks if a value is an object or array.***
 * ---------------------------------------------------------
 *
 * Will return `false` for `null`, `undefined`, and primitives.
 *
 * @param {unknown} val - The value to check.
 * @returns {val is object} Returns `true` if the value is an object or array.
 *
 * @example
 * isObjectOrArray({ name: "Alice" }); // true
 * isObjectOrArray([1,2,3]);           // true
 * isObjectOrArray(null);              // false
 * isObjectOrArray("hello");           // false
 */
export const isObjectOrArray = <T>(val: T): val is NonNullable<T> => {
  return typeof val === "object" && !isNil(val);
};
