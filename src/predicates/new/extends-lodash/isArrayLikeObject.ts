/* eslint-disable @typescript-eslint/no-explicit-any */
import { isLength, isObjectOrArray } from "@/index";
import type { AnyFunction } from "@/types";

/** ----------------------------------------------------
 * * ***This method is like `isArrayLike` except that it also checks if `value` is an object.***
 * ----------------------------------------------------
 *
 * @param {*} value The value to check.
 *
 * @returns Returns `true` if `value` is array-like object, else `false`.
 *
 * @example
 * isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * isArrayLikeObject(document.body.children);
 * // => true
 *
 * isArrayLikeObject('abc');
 * // => false
 *
 * isArrayLikeObject(noop);
 * // => false
 */
export function isArrayLikeObject<T extends { __anyHack: unknown }>(
  value: T
): boolean;
export function isArrayLikeObject(
  value:
    | ((...args: any[]) => any)
    | AnyFunction
    | string
    | boolean
    | number
    | null
    | undefined
): value is never;
export function isArrayLikeObject(
  value: unknown
): value is object & { length: number };
export function isArrayLikeObject(value?: unknown) {
  return isObjectOrArray(value) && isLength((value as any).length);
}
