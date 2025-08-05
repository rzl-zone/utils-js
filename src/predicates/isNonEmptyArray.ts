/** ----------------------------------------------------------
 * * ***Type guard: Checks if a value is a non-empty array.***
 * ----------------------------------------------------------
 *
 * - ✅ Ensures the value is an actual array using `Array.isArray`.
 * - ✅ Ensures the array contains at least one item.
 * - ✅ Narrows type to `T[]` (non-empty array) when true.
 *
 * @param value - The value to check.
 * @returns {value is T[]} - `true` if value is a non-empty array.
 *
 * @example
 * isNonEmptyArray([1, 2, 3]); // true
 * isNonEmptyArray([]);       // false
 * isNonEmptyArray(null);     // false
 * isNonEmptyArray("test");   // false
 */
export const isNonEmptyArray = <T = unknown>(value: unknown): value is T[] => {
  return Array.isArray(value) && value.length > 0;
};
