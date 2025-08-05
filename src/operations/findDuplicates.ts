import { isArray, isEqual } from "@/index";

/** ----------------------------------------------------------------------
 * * ***Finds duplicate values in an array by deep equality comparison.***
 * ----------------------------------------------------------------------
 *
 * - ✔ Uses `isEqual` to compare elements (handles objects, arrays, dates, NaN, etc.)
 * - ✔ Returns a new array containing only the *first occurrences* of duplicated values.
 * - ✔ Does **not mutate** the original array.
 * - ✔ Throws `TypeError` if input is not an array.
 *
 * @template T Type of elements in the input array.
 * @param {T[]} values - The array to check for duplicates.
 * @returns {T[]} An array of the duplicate values found in the input,
 *                preserving order of their first duplicate appearance.
 *
 * @throws {TypeError} If the provided `values` argument is not an array.
 *
 * @example
 * findDuplicates([1, 2, 2, 3, 4, 4]); // => [2, 4]
 * findDuplicates(["apple", "banana", "apple", "orange"]); // => ["apple"]
 * findDuplicates([{ a: 1 }, { a: 1 }, { a: 2 }]); // => [{ a: 1 }]
 * findDuplicates([NaN, NaN, 1]); // => [NaN]
 * findDuplicates([true, false, true]); // => [true]
 * findDuplicates([1, 2, 3]); // => []
 */
export const findDuplicates = <T>(values: T[]): T[] => {
  if (!isArray(values)) {
    throw new TypeError("Expected 'values' to be a 'array' type");
  }

  const duplicates: T[] = [];
  values.forEach((item, index) => {
    for (let i = index + 1; i < values.length; i++) {
      if (isEqual(item, values[i])) {
        if (!duplicates.some((dup) => isEqual(dup, item))) {
          duplicates.push(item);
        }
        break;
      }
    }
  });

  return duplicates;
};
