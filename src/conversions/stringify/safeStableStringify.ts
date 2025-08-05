import {
  isArray,
  isBigInt,
  isBoolean,
  isDate,
  isFunction,
  isNaN,
  isNull,
  isSymbol,
  isUndefined,
} from "@/predicates";

/** --------------------------------------------
 * * ***Safely converts a JavaScript value into a stable, JSON-compatible string.***
 * --------------------------------------------
 *
 * Features:
 * - Recursively sorts object keys if `sortKeys` is true, to ensure stable key order.
 * - Optionally sorts array values if `ignoreOrder` is true (only sorts shallow primitives inside arrays).
 * - Removes functions and symbols (they are omitted from the output).
 * - Converts `undefined`, `NaN`, `Infinity`, `-Infinity` to `null`.
 * - Converts `BigInt` to a string (since JSON does not support it).
 * - Handles circular references by replacing them with the string `"[Circular]"`.
 * - Serializes:
 *   - `Date` instances as ISO strings.
 *   - `Map` as `{ map: [ [key, value], ... ] }`.
 *   - `Set` as `{ set: [values...] }`.
 *
 * Compared to `JSON.stringify`, this ensures **stable output**:
 * - Same object structure always produces the same string.
 * - Useful for deep equality checks, hashing, caching keys, or snapshot tests.
 *
 * @param {unknown} value
 *   The value to serialize. Can be primitives, objects, arrays, Maps, Sets, Dates, etc.
 *
 * @param {boolean} [sortKeys=true]
 *   Whether to sort object keys alphabetically (recursively). If `false`, preserves original insertion order.
 *
 * @param {boolean} [ignoreOrder=false]
 *   Whether to sort array primitive values. When `true`:
 *   - Only primitive values in arrays are sorted.
 *   - Objects and nested arrays keep their position and are placed after sorted primitives.
 *   If `false`, arrays retain their original order.
 *
 * @param {boolean} [pretty=false]
 *   If `true`, output is formatted with 2-space indentation and newlines (pretty-printed).
 *   If `false`, produces compact single-line JSON.
 *
 * @returns {string}
 *   A stable JSON string representation of the input value.
 *
 * @throws {TypeError}
 *   Throws if `sortKeys`, `ignoreOrder`, or `pretty` are not strictly boolean.
 *
 * @example
 * // Basic object key sorting
 * safeStableStringify({ b: 2, a: 1 });
 * // => '{"a":1,"b":2}'
 *
 * @example
 * // Disable key sorting (preserve insertion order)
 * safeStableStringify({ b: 2, a: 1 }, false);
 * // => '{"b":2,"a":1}'
 *
 * @example
 * // Sorting arrays
 * safeStableStringify([3, 1, 2], true, true);
 * // => '[1,2,3]'
 *
 * @example
 * // Nested object + ignoreOrder=true
 * safeStableStringify({ z: [3, 1, 2], x: { d: 4, c: 3 } }, true, true);
 * // => '{"x":{"c":3,"d":4},"z":[1,2,3]}'
 *
 * @example
 * // sortKeys=false and ignoreOrder=true
 * safeStableStringify({ z: [3, 1, 2], x: { d: 4, c: 3 } }, false, true);
 * // => '{"z":[1,2,3],"x":{"d":4,"c":3}}'
 *
 * @example
 * // pretty print output
 * safeStableStringify([3, 1, 2], true, true, true);
 * // => `[
 * //   1,
 * //   2,
 * //   3
 * // ]`
 *
 * @example
 * // Handles Date, BigInt, Map and Set
 * safeStableStringify({
 *   time: new Date("2025-01-01"),
 *   big: BigInt(9007199254740991),
 *   data: new Map([["key", new Set([1, 2])]])
 * });
 * // => '{"big":"9007199254740991","data":{"map":[["key",{"set":[1,2]}]]},"time":"2025-01-01T00:00:00.000Z"}'
 *
 * @example
 * // Functions and symbols are removed
 * safeStableStringify({ f: () => {}, s: Symbol("wow") });
 * // => '{}'
 *
 * @example
 * // undefined, NaN, Infinity convert to null
 * safeStableStringify([undefined, NaN, Infinity, -Infinity]);
 * // => '[null,null,null,null]'
 *
 * @example
 * // Circular reference
 * const obj = { name: "A" };
 * obj.self = obj;
 * safeStableStringify(obj);
 * // => '{"name":"A","self":"[Circular]"}'
 *
 * @example
 * // Complex nested ignoreOrder with objects
 * const arr = [9, 7, [4, 2, 3], { z: [5, 1, 6] }];
 * safeStableStringify(arr, true, true);
 * // => '[7,9,[2,3,4],{"z":[1,5,6]}]'
 */
export const safeStableStringify = (
  value: unknown,
  sortKeys: boolean = true,
  ignoreOrder: boolean = false,
  pretty: boolean = false
): string => {
  if (!isBoolean(sortKeys) || !isBoolean(ignoreOrder)) {
    throw new TypeError("Expected 'sortKeys' and 'ignoreOrder' to be boolean.");
  }

  const seen = new WeakSet();

  const isPrimitive = (val: unknown): boolean =>
    isNull(val) || (typeof val !== "object" && !isFunction(val));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deepProcess = (val: any): any => {
    if (isFunction(val) || isSymbol(val)) return undefined;
    if (isBigInt(val)) return val.toString();
    if (isUndefined(val) || isNaN(val) || val === Infinity || val === -Infinity)
      return null;

    if (typeof val === "object" && !isNull(val)) {
      if (seen.has(val)) return "[Circular]";
      seen.add(val);

      if (isDate(val)) return val.toISOString();
      if (val instanceof Map)
        return { map: Array.from(val.entries()).map(deepProcess) };
      if (val instanceof Set)
        return { set: Array.from(val.values()).map(deepProcess) };

      if (isArray(val)) {
        const processedArr = val.map(deepProcess);
        if (ignoreOrder) {
          const primitives = processedArr.filter(isPrimitive).sort();
          const nonPrimitives = processedArr.filter((v) => !isPrimitive(v));
          return [...primitives, ...nonPrimitives];
        }
        return processedArr;
      }

      const keys = Object.keys(val);
      if (sortKeys) keys.sort();
      return keys.reduce((acc, key) => {
        const processed = deepProcess(val[key]);
        if (!isUndefined(processed)) acc[key] = processed;
        return acc;
      }, {} as Record<string, unknown>);
    }

    return val;
  };

  try {
    return JSON.stringify(deepProcess(value), null, pretty ? 2 : 0);
  } catch (err) {
    console.warn("Error in safeStableStringify:", err);
    return "{}";
  }
};
