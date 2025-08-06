import type { NonPlainObject } from "@/types";
import { isArray, isNil } from "@/index";

type IsObject<T = unknown> = unknown extends T
  ? Record<string, unknown> & unknown
  : T extends object
  ? T extends NonPlainObject
    ? never
    : T
  : never;

/** ---------------------------------------------------------
 * * ***Type guard: Checks if a value is a plain object.***
 * ---------------------------------------------------------
 *
 * Will return `false` for arrays, undefined and `null`.
 *
 * @param {unknown} val - The value to check.
 * @returns {val is Record<string, unknown>} Returns `true` if the value is a plain object, otherwise `false`.
 *
 * @example
 * isObject({ name: "Alice" }); // true
 * isObject([1,2,3]);           // false
 * isObject(null);              // false
 * isObject(undefined);         // false
 */
export function isObject<T>(val: T): val is IsObject<T>;
export function isObject(val: unknown): boolean {
  return typeof val === "object" && !isNil(val) && !isArray(val);
}
