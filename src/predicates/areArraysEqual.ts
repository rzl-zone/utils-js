import { safeStableStringify, isArray, isBoolean, isEqual } from "@/index";

/** ----------------------------------------------------------
 * * ***Compares two arrays deeply to check if they are equal.***
 * ----------------------------------------------------------
 *
 * Supports deep comparison of arrays containing nested arrays or objects.
 * Can also ignore the order of elements at all levels by recursively sorting.
 *
 * ----------------------------------------------------------
 *
 * @param {unknown[]} arr1
 *    The first array to compare. Can contain nested arrays or objects.
 *
 * @param {unknown[]} arr2
 *    The second array to compare against. Should match structure of `arr1`.
 *
 * @param {boolean} [ignoreOrder=false]
 *    Whether to ignore the order of elements when comparing.
 *    If `true`, will sort both arrays recursively before comparing.
 *    Default is `false`.
 *
 * @returns {boolean}
 *    Returns `true` if both arrays are deeply equal, otherwise `false`.
 *
 * @throws {TypeError}
 *    Throws if `arr1` or `arr2` are not arrays, or if `ignoreOrder` is not a boolean.
 *
 * @example
 * areArraysEqual([1, 2, 3], [1, 2, 3]);
 * // → true
 *
 * @example
 * areArraysEqual([1, 2, 3], [3, 2, 1]);
 * // → false
 *
 * @example
 * areArraysEqual([1, 2, 3], [3, 2, 1], true);
 * // → true (order ignored)
 *
 * @example
 * areArraysEqual([{ x: 1 }, { y: 2 }], [{ y: 2 }, { x: 1 }], true);
 * // → true
 *
 * ----------------------------------------------------------
 *
 * @internal
 * @function deepIgnoreOrder
 * Recursively sorts an array and its nested arrays so deep comparison
 * can ignore element order at all levels.
 *
 * @param {unknown[]} arr
 *    The array to deep sort.
 *
 * @returns {unknown[]}
 *    A new deeply sorted array.
 */
export const areArraysEqual = (
  arr1: unknown[],
  arr2: unknown[],
  ignoreOrder: boolean = false
): boolean => {
  if (!(isArray(arr1) && isArray(arr2))) {
    throw new TypeError(`props 'arr1' and 'arr2' must be \`array\` type!`);
  }
  if (!isBoolean(ignoreOrder)) {
    throw new TypeError(`props 'ignoreOrder' must be \`boolean\` type!`);
  }

  if (!isEqual(arr1.length, arr2.length)) return false;

  /**
   * Recursively sorts an array (and nested arrays) so that
   * deep equality checks can ignore order at all levels.
   *
   * @param {unknown[]} arr - The array to deep sort.
   * @returns {unknown[]} A new deeply sorted array.
   */
  const deepIgnoreOrder = (arr: unknown[]): unknown[] => {
    if (!isArray(arr)) return arr;

    // Recursively sort nested arrays
    const sorted = arr.map((item) => {
      if (isArray(item)) {
        return deepIgnoreOrder(item);
      }
      return item;
    });

    // Sort current array level
    return sorted.sort((a, b) => {
      const sa = safeStableStringify(a);
      const sb = safeStableStringify(b);
      return sa < sb ? -1 : sa > sb ? 1 : 0;
    });
  };

  const normalizedArr1 = ignoreOrder ? deepIgnoreOrder(arr1) : arr1;
  const normalizedArr2 = ignoreOrder ? deepIgnoreOrder(arr2) : arr2;

  if (!isEqual(normalizedArr1.length, normalizedArr2.length)) return false;

  return normalizedArr1.every(
    (item, index) =>
      safeStableStringify(item) === safeStableStringify(normalizedArr2[index])
  );
};
