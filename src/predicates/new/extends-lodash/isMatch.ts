import { baseIsMatch } from "./private/baseIsMatch";

/** ----------------------------------------------------
 * * ***Performs a partial deep comparison between `object` and `source` to determine if `object` contains equivalent property values.***
 * ----------------------------------------------------
 *
 * - This method returns `true` if all the properties in `source` exist in `object` and are deeply equal.
 * - It does **not** require `object` and `source` to be the same shape—only that `object` contains a subset that matches `source`.
 *
 * ⚠️ Arrays are treated as objects: only the matching indexed keys are compared.
 *
 * @remarks
 * - This method is equivalent to a partially applied `matches(source)` predicate.
 * - Partial comparisons will match:
 *   - An empty array (`[]`) in `source` with any array in `object`.
 *   - An empty object (`{}`) in `source` with any object in `object`.
 *
 * @param object - The object to inspect.
 * @param source - The object containing property values to match.
 * @returns Returns `true` if `object` is a match, else `false`.
 *
 * @example
 * const object = { a: 1, b: 2 };
 *
 * isMatch(object, { b: 2 });
 * // => true
 *
 * isMatch(object, { b: 1 });
 * // => false
 *
 * isMatch([1, 2, 3], [1, 2]);
 * // => true (treats arrays as objects with index keys)
 */
export function isMatch(object: object, source: object): boolean {
  return baseIsMatch(object, source);
}
