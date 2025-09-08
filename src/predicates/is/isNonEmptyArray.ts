/** ----------------------------------------------------------
 * * ***Type guard: `isNonEmptyArray`.***
 * ----------------------------------------------------------
 * **Checks if a value is a **non-empty array**.**
 * - **Behavior:**
 *    - Ensures the value is an actual array using **[`Array.isArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray)**.
 *    - Ensures the array contains at least one item.
 *    - Narrows type to `T[]` (non-empty array) when true.
 * @template T - The type of the value being checked.
 * @param {*} value - The value to check.
 * @returns {boolean} Return `true` if value is a non-empty array.
 * @example
 * isNonEmptyArray([1, 2, 3]); // ➔ true
 * isNonEmptyArray([]);        // ➔ false
 * isNonEmptyArray(null);      // ➔ false
 * isNonEmptyArray("test");    // ➔ false
 */
export function isNonEmptyArray(value: []): value is [];
export function isNonEmptyArray<T extends unknown[]>(
  value: T
): value is NonNullable<Extract<T, unknown[]>>;
export function isNonEmptyArray(value: unknown): value is unknown[];
export function isNonEmptyArray(value: unknown): boolean {
  return Array.isArray(value) && value.length > 0;
}
