/* eslint-disable @typescript-eslint/no-explicit-any */

import { isLength } from "@/index";

/** ----------------------------------------------------
 * * ***Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.***
 * ----------------------------------------------------
 *
 * @param {*} value The value to check.
 *
 * @returns Returns `true` if `value` is array-like, else `false`.
 *
 * @example
 * isArrayLike([1, 2, 3]);
 * // => true
 *
 * isArrayLike(document.body.children);
 * // => true
 *
 * isArrayLike('abc');
 * // => true
 *
 * isArrayLike(noop);
 * // => false
 */
export function isArrayLike<T extends { __anyHack: unknown }>(
  value: T
): boolean;
export function isArrayLike(
  value: ((...args: any[]) => any) | null | undefined
): value is never;
export function isArrayLike(value: unknown): value is { length: number };
export function isArrayLike(value?: unknown) {
  return (
    value != null &&
    typeof value !== "function" &&
    isLength((value as any)?.length)
  );
}
