import type { AnyFunction } from "@/types";
import { isNil } from "@/index";

export type IsObjectOrArray<T> = unknown extends T
  ? Record<string, unknown> | unknown[]
  : T extends object
  ? T extends AnyFunction
    ? never
    : T extends readonly unknown[]
    ? T
    : T extends null
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
export function isObjectOrArray<T>(value: T): value is IsObjectOrArray<T> {
  return typeof value === "object" && !isNil(value);
}
