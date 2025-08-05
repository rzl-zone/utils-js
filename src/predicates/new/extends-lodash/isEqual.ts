import { baseDeepEqual } from "./private/baseDeepEqual";

/** ----------------------------------------------------
 * * ***Performs a deep comparison between two values to determine if they are equivalent.***
 * ----------------------------------------------------
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are **not** supported.
 *
 *
 * @param value The value to compare.
 * @param other The other value to compare.
 * @returns Returns `true` if the values are equivalent, else `false`.
 *
 * @example
 *
 * const object = { user: "fred" };
 * const other = { user: "fred" };
 *
 * isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */
export function isEqual(value: unknown, other: unknown): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return baseDeepEqual(value, other, undefined, new WeakMap<any, any>());
}
