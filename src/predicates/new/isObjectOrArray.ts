import type { NonPlainObject } from "@/types";
import { isNil } from "@/index";

export type IsObjectOrArray<T> = unknown extends T
  ? Record<string, unknown> | unknown[]
  : T extends object
  ? T extends unknown[]
    ? T
    : T extends NonPlainObject
    ? never
    : T
  : never;

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
// @ts-expect-error ignore error `T` inferred for more strict.
export function isObjectOrArray<T>(value: T): value is IsObjectOrArray<T>;
export function isObjectOrArray<T>(value: T): boolean {
  return typeof value === "object" && !isNil(value);
}
