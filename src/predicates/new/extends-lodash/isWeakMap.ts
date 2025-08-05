/** --------------------------------------------------
 * * ***Checks if `value` is classified as a `WeakMap` object.***
 * --------------------------------------------------
 *
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a weak map, else `false`.
 * @example
 *
 * isWeakMap(new WeakMap);
 * // => true
 *
 * isWeakMap(new Map);
 * // => false
 */
export function isWeakMap<K extends object = object, V = unknown>(
  value: unknown
): value is WeakMap<K, V> {
  return (
    typeof value === "object" && value !== null && value instanceof WeakMap
  );
}
