import { isArray, isNil } from "@/predicates";
import { Prettify } from "type-samurai";

type IsValidObject<T> = NonNullable<
  Extract<Prettify<T, { recursive: true }>, Record<string, unknown>>
>;
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
export function isObject<T>(
  val: T
  // @ts-expect-error no check infer
): val is IsValidObject<T>;
export function isObject(
  val: unknown
): val is NonNullable<Record<string, unknown>>;
export function isObject(val: unknown): boolean {
  return typeof val === "object" && !isNil(val) && !isArray(val);
}
