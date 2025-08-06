import { isObject } from "@/predicates";

/** ----------------------------------------------------
 * * ***Checks if `value` is a plain object, that is, an object created by the `Object` constructor or one with a `[[Prototype]]` of `null`..***
 * ----------------------------------------------------
 *
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * isPlainObject(new Foo);
 * // => false
 *
 * isPlainObject([1, 2, 3]);
 * // => false
 *
 * isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * isPlainObject(Object.create(null));
 * // => true
 */
export function isPlainObject(value: unknown): value is Record<string, unknown>;
export function isPlainObject<T>(
  value: T
): value is NonNullable<Extract<T, Record<string, unknown>>>;
export function isPlainObject(value: unknown): boolean {
  if (!isObject(value)) return false;

  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}
