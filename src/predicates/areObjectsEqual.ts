import { isEqual } from "@/index";

/** ---------------------------------
 * * ***Compares two objects for deep equality.***
 * ---------------------------------
 *  * This Function using `lodash` library.
 *
 * @template T1 The type of the first object.
 * @template T2 The type of the second object.
 * @param {T1} object1 - The first object to compare.
 * @param {T2} object2 - The second object to compare.
 * @returns {boolean} `true` if both objects are deeply equal, otherwise `false`.
 *
 * @example
 * areObjectsEqual({ a: 1, b: 2 }, { a: 1, b: 2 }); // Returns true
 * areObjectsEqual({ a: 1 }, { a: 1, b: undefined }); // Returns false
 * areObjectsEqual([1, 2, 3], [1, 2, 3]); // Returns true
 */
export const areObjectsEqual = (
  object1: unknown,
  object2: unknown
): boolean => {
  return isEqual(object1, object2);
};
