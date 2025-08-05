import type { isMatchWithCustomizer } from "@/types/private/predicates/new/isMatchWith";
import { baseIsMatch } from "./private/baseIsMatch";

/** ----------------------------------------------------
 * * ***Performs a partial deep comparison between `object` and `source`,
 *   like `isMatch`, but with a `customizer` function to control comparisons.***
 * ----------------------------------------------------
 *
 * If `customizer` returns a value other than `undefined`, that value is used
 * as the result of the comparison for the current property. Otherwise,
 * the comparison falls back to the default deep equality logic.
 *
 * @remarks
 * - The `customizer` function is invoked with up to **five** arguments:
 *   `(objValue, srcValue, keyOrIndex, object, source)`.
 * - Returning `true` from `customizer` will short-circuit further comparison
 *   for that key.
 * - Returning `false` will cause `isMatchWith` to return `false` immediately.
 * - Returning `undefined` allows default comparison to proceed.
 *
 * @category Lang
 *
 * @param object - The object to inspect.
 * @param source - The object of property values to match.
 * @param customizer - The function to customize comparisons.
 * @returns Returns `true` if `object` is a match, else `false`.
 *
 * @example
 * function isGreeting(value: unknown) {
 *   return typeof value === 'string' && /^h(?:i|ello)$/.test(value);
 * }
 *
 * function customizer(objValue: unknown, srcValue: unknown) {
 *   if (isGreeting(objValue) && isGreeting(srcValue)) {
 *     return true;
 *   }
 * }
 *
 * const object = { greeting: 'hello' };
 * const source = { greeting: 'hi' };
 *
 * isMatchWith(object, source, customizer);
 * // => true
 */
export function isMatchWith(
  value: object,
  other: object,
  customizer?: isMatchWithCustomizer
): boolean {
  return baseIsMatch(value, other, customizer);
}
