import {
  isArray,
  isBoolean,
  isEmptyArray,
  isEqual,
  isNil,
  isNull,
  isObject,
  isUndefined,
  toStringDeepForce,
} from "@/index";
import type { DedupeResult } from "./transforms.types";

/** ----------------------------------------------------------
 * * ***Removes `null` and `undefined` values from an array, including nested arrays.***
 * ----------------------------------------------------------
 *
 * - ✅ Returns `undefined` if the input is explicitly `undefined` or `null`.
 * - ✅ Returns `[]` if input is empty or all elements are removed after filtering.
 * - ✅ Recursively filters nested arrays while preserving structure.
 * - ✅ Ensures proper type inference for safer downstream operations.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} [input] - The array to be filtered.
 * @returns {T[] | undefined} A new array with `null` and `undefined` values removed,
 * or `undefined` if the input is explicitly `undefined` or `null`.
 *
 * @example
 * filterNullArray([1, null, 2, undefined, 3]);
 * // => [1, 2, 3]
 *
 * @example
 * filterNullArray([null, undefined]);
 * // => []
 *
 * @example
 * filterNullArray(undefined);
 * // => undefined
 * @example
 * filterNullArray(null);
 * // => undefined
 *
 * @example
 * filterNullArray([]);
 * // => []
 *
 * @example
 * filterNullArray([1, [null, 2, [undefined, 3]]]);
 * // => [1, [2, [3]]]
 */
export const filterNullArray = <T>(input?: T[] | null): T[] | undefined => {
  // explicit undefined|null input
  if (isNil(input)) return undefined;

  if (!isArray(input)) return [];

  const filtered = input.reduce<T[]>((output, element) => {
    if (!isNull(element) && !isUndefined(element)) {
      if (isArray(element)) {
        const cleanedNested = filterNullArray(element);
        if (cleanedNested && !isEmptyArray(cleanedNested)) {
          output.push(cleanedNested as unknown as T);
        }
      } else {
        output.push(element);
      }
    }
    return output;
  }, []);

  return filtered;
};

/** ----------------------------------------------------------
 * * ***Deduplicates values in an array (with optional flattening and deep stringification).***
 * ----------------------------------------------------------
 *
 * Supports various modes for converting values to strings before deduplication:
 * - `"stringOrNumber"`: Converts strings and numbers to strings.
 * - `"primitives"`: Converts all primitives (string, number, boolean, bigint, null, undefined, NaN) to strings.
 * - `"all"`: Converts all values (primitives, objects, Maps, Sets, Symbols, RegExp, Dates, Errors, Promises, functions)
 *   to strings, including nested object properties.
 * - `false` (default): No conversion applied.
 *
 * Options:
 * - `forceToString`: Enables string conversion for comparison, default is `false`.
 * - `flatten`: If true, deeply flattens arrays, Maps, and Sets before deduplication, default is `false`.
 *
 * @template FTS - `forceToString` mode.
 * @template FTN - `flatten` mode.
 *
 * @param {unknown[]} inputArray - The array to deduplicate. Can be deeply nested and contain any mix of types.
 * @param {{ forceToString?: false | "stringOrNumber" | "primitives" | "all" }} [options] - Options to control string conversion.
 * @returns {DedupeResult<FTS, FTN>} Deduplicated array with optional transformations.
 *
 * @throws {TypeError} If the input is not an array, or options is not an object, or if `forceToString` is invalid.
 *
 * @example
 * dedupeArray(["apple", "banana", "apple"]);
 * // => ["apple", "banana"]
 *
 * @example
 * dedupeArray([[1, 2], [1, 2]], { flatten: true });
 * // => [1, 2]
 *
 * @example
 * dedupeArray([new Set([1, 2]), new Set([2, 3])], { flatten: true });
 * // => [1, 2, 3]
 *
 * @example
 * dedupeArray([1, "1", 2, "2"], { forceToString: "stringOrNumber" });
 * // => ["1", "2"]
 *
 * @example
 * dedupeArray([true, "true", false, undefined], { forceToString: "primitives" });
 * // => ["true", "false", "undefined"]
 *
 * @example
 * dedupeArray([1, "1", { a: 1 }], { forceToString: "all" });
 * // => ["1", { a: "1" }]
 *
 * @example
 * dedupeArray([1, 1, [2, 2, [3, 3]]]);
 * // => [1, [2, [3]]]
 *
 * @example
 * dedupeArray([null, undefined, null]);
 * // => [null, undefined]
 *
 * @example
 * dedupeArray([[], [[]], [[[]]], [[]], [[[]]]]);
 * // => [[], [[]], [[[]]]]
 *
 * @example
 * const fn = () => 1;
 * dedupeArray([fn, fn, () => 1]);
 * // => [fn, () => 1] cause: ref () => 1 and fn is different but ref const `fn` and `fn` is same ref.
 *
 * @example
 * dedupeArray([Symbol("x"), Symbol("x")]);
 * // => [Symbol("x")] (symbols are same by identity, so dedupe
 *
 * @example
 * dedupeArray([NaN, NaN, 1, "1"]);
 * // => [NaN, 1, "1"]
 *
 * @example
 * dedupeArray([NaN, NaN, 1, "1"], { forceToString: "primitives" });
 * // => ["NaN", "1"]
 *
 * @example
 * dedupeArray([new Date("2025-01-01"), new Date("2025-01-01")]);
 * // => [Date("2025-01-01")] (same time, deduped)
 *
 * @example
 * dedupeArray([new Date("2025-01-01"), new Date("2025-01-01")], { forceToString: "all" });
 * // => ["2025-01-01T00:00:00.000Z"]
 *
 * @example
 * dedupeArray([/abc/, /abc/], { forceToString: "all" });
 * // => ["/abc/"]
 *
 * @example
 * dedupeArray([new Map(), new Set(), new Error("err")], { forceToString: "all" });
 * // => ["[object Map]", "[object Set]", "Error: err"]
 *
 * @example
 * dedupeArray([Promise.resolve(1), Promise.resolve(1)], { forceToString: "all" });
 * // => ["[object Promise]"]
 *
 * @example
 * dedupeArray([{ a: 1 }, { a: 1 }, { a: 2 }], { forceToString: "primitives" });
 * // => [{ a: "1" }, { a: "2" }]
 *
 * @example
 * dedupeArray([{ a: { b: 1 } }, { a: { b: 1 } }], { forceToString: "all" });
 * // => [{ a: { b: "1" } }]
 *
 * @example
 * dedupeArray("not an array");
 * // Throws TypeError
 *
 * @example
 * dedupeArray([1, 2, 3], { forceToString: "invalid" });
 * // Throws TypeError
 */
export const dedupeArray = <
  FTS extends false | "stringOrNumber" | "primitives" | "all" = false,
  FTN extends boolean = false
>(
  inputArray: unknown[],
  options?: {
    /** Enables string conversion for comparison, default is `false`.
     *
     * @default false
     */
    forceToString?: FTS;
    /** If true, deeply flattens arrays, Maps, and Sets before deduplication, default is `false`.
     *
     * @default false
     */
    flatten?: FTN;
  }
): DedupeResult<FTS, FTN> => {
  if (!isArray(inputArray)) {
    throw new TypeError(`'inputArray' must be an array`);
  }
  if (!isObject(options)) {
    throw new TypeError(`'options' must be an object`);
  }

  const { forceToString = false, flatten = false } = options ?? {};
  if (
    !(
      forceToString === false ||
      forceToString === "stringOrNumber" ||
      forceToString === "primitives" ||
      forceToString === "all"
    )
  ) {
    throw new TypeError(
      `'forceToString' must be false | "stringOrNumber" | "primitives" | "all"`
    );
  }

  if (!isBoolean(flatten)) {
    throw new TypeError(`'flatten' must be boolean`);
  }

  const process = (arr: unknown[]): unknown[] => {
    const seen: unknown[] = [];
    return arr.reduce<unknown[]>((acc, item) => {
      const value = isArray(item)
        ? process(item)
        : toStringDeepForce(item, forceToString);

      if (!seen.some((s) => isEqual(s, value))) {
        seen.push(value);
        acc.push(value);
      }
      return acc;
    }, []);
  };

  const deepFlatten = (value: unknown): unknown[] => {
    if (Array.isArray(value)) {
      return value.flatMap(deepFlatten);
    }

    if (value instanceof Set) {
      return [...value].flatMap(deepFlatten);
    }

    if (value instanceof Map) {
      return [...value.values()].flatMap(deepFlatten);
    }

    return [value];
  };

  return (
    flatten ? process(deepFlatten(inputArray)) : process(inputArray)
  ) as DedupeResult<FTS, FTN>;
};
