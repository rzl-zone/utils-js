import { isObjectOrArray } from "..";
import { isArray } from "./isArray";
import { isDate } from "./isDate";
import { isRegExp } from "./isRegExp";
import { isSymbol } from "./isSymbol";

/**
 * ----------------------------------------------------------
 * *** Performs a deep equality check between two values. ***
 * ----------------------------------------------------------
 *
 * - Compares nested arrays, objects, Dates, RegExp, NaN, Symbols, Set, and Map.
 * - Handles special cases:
 *   - `NaN` is considered equal to `NaN`.
 *   - `Date` objects are equal if `.getTime()` is equal.
 *   - `RegExp` objects are equal if `.toString()` is equal.
 *   - `Symbol("x")` and `Symbol("x")` are treated equal if `.toString()` matches.
 *   - `Set` and `Map` are deeply compared by content (order-insensitive).
 * - Does not support circular references.
 */
export const isDeepEqual = (a: unknown, b: unknown): boolean => {
  // Handle NaN
  if (
    typeof a === "number" &&
    typeof b === "number" &&
    Number.isNaN(a) &&
    Number.isNaN(b)
  ) {
    return true;
  }

  // Primitive equality
  if (a === b) return true;

  // Type mismatch
  if (typeof a !== typeof b) return false;

  // Date
  if (isDate(a) && isDate(b)) {
    return a.getTime() === b.getTime();
  }

  // RegExp
  if (isRegExp(a) && isRegExp(b)) {
    return a.toString() === b.toString();
  }

  // Symbol
  if (isSymbol(a) && isSymbol(b)) {
    return a.toString() === b.toString();
  }

  // Set
  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) return false;
    const bValues = Array.from(b);
    const matched = new Set<number>();

    for (const aVal of a) {
      let found = false;
      for (let i = 0; i < bValues.length; i++) {
        if (matched.has(i)) continue;
        if (isDeepEqual(aVal, bValues[i])) {
          matched.add(i);
          found = true;
          break;
        }
      }
      if (!found) return false;
    }
    return true;
  }

  // Map
  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) return false;
    const bEntries = Array.from(b);
    const matched = new Set<number>();

    for (const [aKey, aVal] of a) {
      let found = false;
      for (let i = 0; i < bEntries.length; i++) {
        if (matched.has(i)) continue;
        const [bKey, bVal] = bEntries[i];
        if (isDeepEqual(aKey, bKey) && isDeepEqual(aVal, bVal)) {
          matched.add(i);
          found = true;
          break;
        }
      }
      if (!found) return false;
    }
    return true;
  }

  // Array
  if (isArray(a) && isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, i) => isDeepEqual(item, b[i]));
  }

  // Object
  if (isObjectOrArray(a) && isObjectOrArray(b) && a && b) {
    if (isArray(a) !== isArray(b)) return false;

    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;

    return aKeys.every((key) =>
      isDeepEqual(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key]
      )
    );
  }

  return false;
};
