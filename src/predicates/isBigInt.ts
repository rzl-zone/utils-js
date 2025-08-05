/** ----------------------------------------------------------
 * * ***Type guard: Checks if a value is of type bigint.***
 * ----------------------------------------------------------
 *
 * - ✅ Uses `typeof value === "bigint"` for strict type checking.
 * - ✅ Supports TypeScript type narrowing with `value is bigint`.
 * - ❗ Returns `false` for `BigInt` object (object-wrapped), e.g. `Object(BigInt(123))`
 *
 * @param value - The value to check.
 * @returns {value is bigint} - `true` if value is a primitive `bigint`.
 *
 * @example
 * isBigInt(123n); // true
 * isBigInt(BigInt(123)); // true
 * isBigInt("123"); // false
 * isBigInt(Object(BigInt(1))); // false
 */
export const isBigInt = (value: unknown): value is bigint => {
  return typeof value === "bigint";
};
