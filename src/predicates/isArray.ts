type IsArray<T> = unknown extends T
  ? unknown[]
  : T extends object
  ? T extends unknown[]
    ? T
    : never
  : never;

/** ----------------------------------------------------------
 * * ***Type guard: Checks if a value is an array.***
 * ----------------------------------------------------------
 *
 * - ✅ Uses `Array.isArray()` for reliable and safe type checking.
 * - ✅ Supports TypeScript **type narrowing** using `value is T[]`.
 * - ✅ Handles edge cases like `null`, `undefined`, and non-array objects.
 *
 * @template T - The expected type of array elements.
 * @param {unknown} value - The value to check.
 * @returns {value is T[]} Returns `true` if the value is an array, otherwise `false`.
 *
 * @example
 * isArray([1, 2, 3]); // true
 * isArray([]); // true
 * isArray("hello"); // false
 * isArray({ key: "value" }); // false
 * isArray(null); // false
 * isArray(undefined); // false
 */
// export function isArray(value: unknown): value is unknown[];
// export function isArray<T>(value: T): value is Extract<T, unknown[]>;
// @ts-expect-error ignore error `T` inferred for more strict.
export function isArray<T>(value: T): value is IsArray<T> {
  return Array.isArray(value);
}
