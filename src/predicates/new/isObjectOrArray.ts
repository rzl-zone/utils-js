import { isNil } from "@/index";

/** ---------------------------------------------------------
 * * ***Type guard: Checks if a value is an object or array.***
 * ---------------------------------------------------------
 *
 * Will return `false` for `null`, `undefined`, and primitives.
 *
 * @param {unknown} value - The value to check.
 * @returns {value is object} Returns `true` if the value is an object or array.
 *
 * @example
 * isObjectOrArray({ name: "Alice" }); // true
 * isObjectOrArray([1,2,3]);           // true
 * isObjectOrArray(null);              // false
 * isObjectOrArray(undefined);         // false
 * isObjectOrArray("hello");           // false
 */
export function isObjectOrArray(value: null | undefined): false;
export function isObjectOrArray(
  value: unknown
): value is unknown[] | Record<string, unknown>;
export function isObjectOrArray<T>(
  value: T
): value is Extract<
  Exclude<T, null | undefined>,
  Record<string, unknown> | unknown[]
>;
export function isObjectOrArray(value: unknown): boolean {
  return typeof value === "object" && !isNil(value);
}
