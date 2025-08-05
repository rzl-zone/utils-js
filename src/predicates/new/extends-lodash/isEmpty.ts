/* eslint-disable @typescript-eslint/no-explicit-any */

import { isArguments, isBuffer, isTypedArray } from "@/index";
import type {
  List,
  EmptyObjectOf,
} from "@/types/private/predicates/new/isEmpty";

/** ----------------------------------------------------
 * * ***Checks if `value` is an empty object, collection, map, or set.***
 * ----------------------------------------------------
 *
 * Objects are considered empty if they have no own enumerable string keyed
 * properties.
 *
 * Array-like values such as `arguments` objects, arrays, buffers, strings, or
 * jQuery-like collections are considered empty if they have a `length` of `0`.
 * Similarly, maps and sets are considered empty if they have a `size` of `0`.
 *
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
 * @example
 *
 * isEmpty(null);
 * // => true
 *
 * isEmpty(true);
 * // => true
 *
 * isEmpty(1);
 * // => true
 *
 * isEmpty([1, 2, 3]);
 * // => false
 *
 * isEmpty({ 'a': 1 });
 * // => false
 */
export function isEmpty<T extends { __trapAny: any }>(value?: T): boolean;
export function isEmpty(value: string): value is "";
export function isEmpty(
  value: Map<any, any> | Set<any> | List<any> | null | undefined
): boolean;
export function isEmpty(value: object): boolean;
export function isEmpty<T extends object>(
  value: T | null | undefined
): value is EmptyObjectOf<T> | null | undefined;
export function isEmpty(value: any): boolean;
export function isEmpty(value: unknown) {
  // null / undefined
  if (value == null) return true;

  const type = typeof value;

  // Boolean, number, symbol
  if (type === "boolean" || type === "number" || type === "symbol") return true;

  // Function → treat like object: check own enumerable keys
  if (type === "function") {
    return Object.keys(value).length === 0;
  }

  // String / Array-like
  if (
    typeof value === "string" ||
    Array.isArray(value) ||
    isArguments(value) ||
    isTypedArray(value)
  ) {
    return value.length === 0;
  }

  // Map / Set
  if (value instanceof Map || value instanceof Set) {
    return value.size === 0;
  }

  // Buffer
  if (isBuffer(value)) {
    return value.length === 0;
  }

  // Object (check own enumerable keys)
  if (typeof value === "object") {
    return Object.keys(value).length === 0;
  }

  return false;
}
