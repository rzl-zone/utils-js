import {
  isArray,
  isBigInt,
  isBoolean,
  isDate,
  isError,
  isFunction,
  isNil,
  isNull,
  isNumber,
  isRegExp,
  isString,
  isSymbol,
} from "@/predicates";

/** ----------------------------------------------------------
 * * ***Recursively converts a value into a string based on the `forceToString` option.***
 * ----------------------------------------------------------
 *
 * - `"stringOrNumber"`: Converts strings and numbers to strings.
 * - `"primitives"`: Converts all primitives (number, string, boolean, bigint, undefined, null, NaN) to strings.
 * - `"all"`: Converts everything, including symbols, functions, Dates, RegExp, Maps, Sets, Errors, Promises,
 *   and deeply all object properties, to strings.
 * - `false` (default): Leaves everything unchanged.
 *
 * Special behaviors:
 * - `NaN` → `"NaN"` only in `"primitives"` or `"all"` mode.
 * - `Date` → ISO string only in `"all"` mode.
 * - `RegExp` → Source string (e.g. `/abc/i`) only in `"all"` mode.
 * - `Symbol` → `Symbol(description)` string only in `"all"` mode.
 * - `Map` → Array of [key, value] pairs with keys/values stringified deeply (only in `"all"` mode).
 * - `Set` → Array of values stringified deeply (only in `"all"` mode).
 * - `Function` → Source code string (e.g. `"() => 1"`) only in `"all"` mode.
 * - `Error`, `Promise` → Stringified via `.toString()` only in `"all"` mode.
 *
 *
 * @param {unknown} value - The value to process. Can be anything: primitive, array, object, function, etc.
 * @param {false | "stringOrNumber" | "primitives" | "all"} forceToString - The mode of string conversion.
 * @returns {unknown} A new value with the conversion applied based on `forceToString`.
 *
 * @example
 * toStringDeepForce(42, "stringOrNumber");
 * // => "42"
 *
 * @example
 * toStringDeepForce(true, "primitives");
 * // => "true"
 *
 * @example
 * toStringDeepForce(null, "primitives");
 * // => "null"
 *
 * @example
 * toStringDeepForce(Symbol("x"), "all");
 * // => "Symbol(x)"
 *
 * @example
 * toStringDeepForce({ a: 1, b: [2, NaN] }, "primitives");
 * // => { a: "1", b: ["2", "NaN"] }
 *
 * @example
 * toStringDeepForce(new Date("2025-01-01"), "all");
 * // => "2025-01-01T00:00:00.000Z"
 *
 * @example
 * toStringDeepForce(() => 1, "all");
 * // => "() => 1"
 *
 * @example
 * toStringDeepForce(/abc/i, "all");
 * // => "/abc/i"
 *
 * @example
 * toStringDeepForce(new Map([["a", 1], ["b", 2]]), "all");
 * // => [["a", "1"], ["b", "2"]]
 *
 * @example
 * toStringDeepForce(new Set([1, 2, 3]), "all");
 * // => ["1", "2", "3"]
 *
 * @example
 * toStringDeepForce(new Error("Oops"), "all");
 * // => "Error: Oops"
 *
 * @example
 * toStringDeepForce(Promise.resolve(1), "all");
 * // => "[object Promise]"
 *
 * @example
 * toStringDeepForce({ func: () => 123 }, "all");
 * // => { func: "() => 123" }
 *
 * @example
 * toStringDeepForce([1, "a", { b: 2 }], false);
 * // => [1, "a", { b: 2 }]
 */
export const toStringDeepForce = (
  value: unknown,
  forceToString: false | "stringOrNumber" | "primitives" | "all"
): unknown => {
  // NaN special
  if (typeof value === "number" && Number.isNaN(value)) {
    return forceToString === "primitives" || forceToString === "all"
      ? "NaN"
      : NaN;
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
  if (typeof value === "object" && !isNull(value)) {
    if (isDate(value)) {
      return forceToString === "all" ? value.toISOString() : value;
    }
    if (isRegExp(value)) {
      return forceToString === "all" ? value.toString() : value;
    }
    if (isError(value) || value instanceof Promise) {
      return forceToString === "all" ? value.toString() : value;
    }

    if (value instanceof Set) {
      return forceToString === "all"
        ? [...value].map((v) => toStringDeepForce(v, forceToString))
        : value;
    }

    if (value instanceof Map) {
      return forceToString === "all"
        ? [...value.entries()].map(([k, v]) => [
            toStringDeepForce(k, forceToString),
            toStringDeepForce(v, forceToString),
          ])
        : value;
    }

    // if (value instanceof Map) {
    //   const obj: Record<string, unknown> = {};
    //   for (const [k, v] of value.entries()) {
    //     obj[String(k)] = toStringDeepForce(v, forceToString);
    //   }
    //   return forceToString === "all" ? obj : value;
    // }

    // if (value instanceof Set) {
    //   return forceToString === "all"
    //     ? Array.from(value).map((v) => toStringDeepForce(v, forceToString))
    //     : value;
    // }
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(value)) {
      result[key] = toStringDeepForce(
        (value as Record<string, unknown>)[key],
        forceToString
      );
    }
    return result;
  }

  return value;
};
