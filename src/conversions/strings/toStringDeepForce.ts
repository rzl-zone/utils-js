import { isMap } from "@/predicates/is/isMap";
import { isNaN } from "@/predicates/is/isNaN";
import { isNil } from "@/predicates/is/isNil";
import { isSet } from "@/predicates/is/isSet";
import { isDate } from "@/predicates/is/isDate";
import { isError } from "@/predicates/is/isError";
import { isArray } from "@/predicates/is/isArray";
import { isBigInt } from "@/predicates/is/isBigInt";
import { isObject } from "@/predicates/is/isObject";
import { isRegExp } from "@/predicates/is/isRegExp";
import { isString } from "@/predicates/is/isString";
import { isNumber } from "@/predicates/is/isNumber";
import { isSymbol } from "@/predicates/is/isSymbol";
import { isBoolean } from "@/predicates/is/isBoolean";
import { isFunction } from "@/predicates/is/isFunction";
import { isObjectOrArray } from "@/predicates/is/isObjectOrArray";
import { getPreciseType } from "@/predicates/type/getPreciseType";
import { safeStableStringify } from "../stringify/safeStableStringify";

/** ----------------------------------------------------------
 * * ***Utility: `toStringDeepForce`.***
 * ---------------------------------------------
 * **Recursively converts a value into a string based on the `forceToString` options.**
 * - **Rules `forceToString` options:**
 *    - `"stringOrNumber"`: Converts strings and numbers to strings.
 *    - `"primitives"`: Converts all primitives (number, string, boolean, bigint, undefined, null, NaN) to strings.
 *    - `"all"`: Converts everything, including symbols, functions, Dates, RegExp, Maps, Sets, Errors, Promises,
 *   and deeply all object properties, to strings.
 *    - `false`: Leaves everything unchanged.
 * - **Special behaviors:**
 *    - `NaN` ➔ `"NaN"` only in `"primitives"` or `"all"` mode.
 *    - `Date` ➔ ISO string only in `"all"` mode.
 *    - `RegExp` ➔ Source string (e.g. `/abc/i`) only in `"all"` mode.
 *    - `Symbol` ➔ `Symbol(description)` string only in `"all"` mode.
 *    - `Map` ➔ Array of [key, value] pairs with keys/values stringified deeply (only in `"all"` mode).
 *    - `Set` ➔ Array of values stringified deeply (only in `"all"` mode).
 *    - `Function` ➔ Source code string (e.g. `"() => 1"`) only in `"all"` mode.
 *    - `Error`, `Promise` ➔ Stringified via `.toString()` only in `"all"` mode.
 * @param {*} value - The value to process. Can be anything: primitive, array, object, function, etc.
 * @param {false | "stringOrNumber" | "primitives" | "all"} forceToString - The mode of string conversion.
 * @returns {unknown} A new value with the conversion applied based on `forceToString`.
 * @example
 * toStringDeepForce(42, "stringOrNumber");
 * // ➔ "42"
 * toStringDeepForce(true, "primitives");
 * // ➔ "true"
 * toStringDeepForce(null, "primitives");
 * // ➔ "null"
 * toStringDeepForce(Symbol("x"), "all");
 * // ➔ "Symbol(x)"
 * toStringDeepForce({ a: 1, b: [2, NaN] }, "primitives");
 * // ➔ { a: "1", b: ["2", "NaN"] }
 * toStringDeepForce(new Date("2025-01-01"), "all");
 * // ➔ "2025-01-01T00:00:00.000Z"
 * toStringDeepForce(() => 1, "all");
 * // ➔ "() => 1"
 * toStringDeepForce(/abc/i, "all");
 * // ➔ "/abc/i"
 * toStringDeepForce(new Map([["a", 1], ["b", 2]]), "all");
 * // ➔ [["a", "1"], ["b", "2"]]
 * toStringDeepForce(new Set([1, 2, 3]), "all");
 * // ➔ ["1", "2", "3"]
 * toStringDeepForce(new Error("Oops"), "all");
 * // ➔ "Error: Oops"
 * toStringDeepForce(Promise.resolve(1), "all");
 * // ➔ "[object Promise]"
 * toStringDeepForce({ func: () => 123 }, "all");
 * // ➔ { func: "() => 123" }
 * toStringDeepForce([1, "a", { b: 2 }], false);
 * // ➔ [1, "a", { b: 2 }]
 */
export function toStringDeepForce(
  value: unknown,
  forceToString: false | "stringOrNumber" | "primitives" | "all"
): unknown {
  if (
    !(
      forceToString === false ||
      forceToString === "stringOrNumber" ||
      forceToString === "primitives" ||
      forceToString === "all"
    )
  ) {
    throw new TypeError(
      `Second parameter \`forceToString\` must be of type \`false\` or \`string\` with value one of "stringOrNumber" | "primitives" | "all", but received: \`${getPreciseType(
        forceToString
      )}\`, with value: \`${safeStableStringify(forceToString)}\`.`
    );
  }

  // NaN special
  if (isNaN(value)) {
    return forceToString === "primitives" || forceToString === "all" ? "NaN" : NaN;
  }

  // string or number
  if (isString(value) || isNumber(value)) {
    return forceToString === "stringOrNumber" ||
      forceToString === "primitives" ||
      forceToString === "all"
      ? String(value)
      : value;
  }

  // other primitives
  if (isBoolean(value) || isBigInt(value) || isNil(value)) {
    return forceToString === "primitives" || forceToString === "all"
      ? String(value)
      : value;
  }

  // symbol
  if (isSymbol(value)) {
    return forceToString === "all" ? value.toString() : value;
  }

  // function: only convert on "all"
  if (isFunction(value)) {
    return forceToString === "all" ? value.toString() : value;
  }

  // array
  if (isArray(value)) {
    return value.map((v) => toStringDeepForce(v, forceToString));
  }

  // objects
  if (isObjectOrArray(value)) {
    if (isDate(value)) {
      return forceToString === "all" ? value.toISOString() : value;
    }
    if (isRegExp(value)) {
      return forceToString === "all" ? value.toString() : value;
    }
    if (isError(value) || value instanceof Promise) {
      return forceToString === "all" ? value.toString() : value;
    }

    if (isSet(value)) {
      return forceToString === "all"
        ? [...value].map((v) => toStringDeepForce(v, forceToString))
        : value;
    }

    if (isMap(value)) {
      return forceToString === "all"
        ? [...value.entries()].map(([k, v]) => [
            toStringDeepForce(k, forceToString),
            toStringDeepForce(v, forceToString)
          ])
        : value;
    }

    const result: Record<string, unknown> = {};
    if (isObject(value)) {
      for (const key of Object.keys(value)) {
        result[key] = toStringDeepForce(value[key], forceToString);
      }
    }
    return result;
  }

  return value;
}
