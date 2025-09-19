import type {
  IsArray,
  IsNever,
  IsReadonlyArray,
  IsUnknown
} from "@rzl-zone/ts-types-plus";

/** @deprecated bugs */
export type IsArrayResult<T> = IsUnknown<T> extends true
  ? unknown[] & T
  : IsNever<T> extends true
  ? []
  : IsReadonlyArray<T> extends true
  ? T
  : IsArray<T> extends true
  ? T
  : unknown[];

/** ----------------------------------------------------------
 * * ***Type guard: `isArray`.***
 * ----------------------------------------------------------
 ***Checks if a value is an ***[`Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)***.**
 * - **Behavior:**
 *    - Uses ***[`Array.isArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray)*** for reliable and safe type checking.
 *    - Supports TypeScript **type narrowing** using `value is T[]`.
 *    - Handles edge cases like `null`, `undefined`, and non-array objects.
 * @template T - The expected type of array elements.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the value is an `array`, otherwise `false`.
 * @example
 * isArray([1, 2, 3]);
 * // ➔ true
 * isArray([]);
 * // ➔ true
 * isArray("hello");
 * // ➔ false
 * isArray({ key: "value" });
 * // ➔ false
 * isArray(null);
 * // ➔ false
 * isArray(undefined);
 * // ➔ false
 */
export function isArray<T extends unknown[]>(value: T): value is Extract<T, unknown[]>;
export function isArray<T extends readonly unknown[]>(
  value: T
): value is Extract<T, readonly unknown[]>;
export function isArray(value: unknown): value is unknown[];
export function isArray(value: unknown): boolean {
  return Array.isArray(value);
}
