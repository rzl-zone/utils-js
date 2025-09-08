import type { CustomizerIsEqualWith } from "@/types/private";
import { baseDeepEqual } from "@/predicates/is/private/baseDeepEqual";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { isEqual } from "../is/isEqual";

/** ----------------------------------------------------
 * * ***Predicate: `isEqualWith`.***
 * ----------------------------------------------------
 * **Performs a deep comparison between two values with support for a
 * customizer function.**
 * @description
 * This method is like **{@link isEqual | `isEqual`}** except that it
 * accepts a `customizer` which is invoked to compare values.
 * - **Behavior:**
 *     - If `customizer` returns `undefined`, the comparison is handled by
 *       the default deep equality algorithm.
 *     - The `customizer` is invoked with up to six arguments:
 *       - `(value, other, indexOrKey, parent, otherParent, stack)`,
 *         see **{@link CustomizerIsEqualWith | `CustomizerIsEqualWith`}**.
 *     - Supports comparing `arrays`, `objects`, `maps`, `sets`, `dates`,
 *       `regexes`, `typed arrays`, `etc`.
 *     - Functions and DOM nodes are **not** supported.
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {CustomizerIsEqualWith} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 * function isGreeting(value: unknown) {
 *   return typeof value === "string" && /^h(?:i|ello)$/.test(value);
 * }
 *
 * function customizer(objValue: unknown, othValue: unknown) {
 *   if (isGreeting(objValue) && isGreeting(othValue)) {
 *     return true;
 *   }
 * }
 *
 * const array = ["hello", "goodbye"];
 * const other = ["hi", "goodbye"];
 *
 * isEqualWith(array, other, customizer);
 * // ➔ true
 */
export function isEqualWith(
  value: unknown,
  other: unknown,
  customizer?: CustomizerIsEqualWith
): boolean {
  return baseDeepEqual(value, other, customizer, new WeakMap());
}
