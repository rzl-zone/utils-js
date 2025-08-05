import {
  isArray,
  isBoolean,
  isEmptyArray,
  isFinite,
  isNil,
  isNumber,
  isObject,
  isString,
  isUndefined,
} from "@/predicates";

/** --------------------------------------------------
 * * ***Type utility to define the output type while maintaining structure.***
 * --------------------------------------------------
 * - Converts string and number to `number`.
 * - Removes `null`, `undefined`, and non-numeric values.
 * - Supports deeply nested structures.
 * - Keeps empty arrays and objects unless `removeEmptyObjects` or `removeEmptyArrays` is enabled.
 */
type ConvertedDeepNumber<
  T,
  RemoveEmptyObjects extends boolean,
  RemoveEmptyArrays extends boolean
> = T extends null | undefined
  ? never // Removes null & undefined
  : T extends number | `${number}`
  ? number // Convert valid number
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends any[]
  ? ConvertedDeepNumber<T[number], RemoveEmptyObjects, RemoveEmptyArrays>[] // Maintain array structure
  : T extends Record<string, unknown>
  ? {
      [K in keyof T]: ConvertedDeepNumber<
        T[K],
        RemoveEmptyObjects,
        RemoveEmptyArrays
      >;
    } extends infer O
    ? RemoveEmptyObjects extends true
      ? keyof O extends never
        ? never // Remove empty object if flag is enabled
        : O
      : O
    : never
  : never; // Remove unsupported types

/** --------------------------------------------------
 * * ***Converts deeply nested arrays or objects into number while preserving structure.***
 * --------------------------------------------------
 *
 * Features:
 * - ✅ Removes `null`, `undefined`, NaN, Infinity, and non-numeric values.
 * - 🔄 Recursively processes nested objects and arrays.
 * - 🔢 Converts valid number, including decimals (e.g. `"3.5"` → `3.5`).
 * - 🧹 Can remove empty objects `{}` or arrays `[]` based on flags.
 *
 * @template T - The input data type (Array, Object, etc)
 * @template RemoveEmptyObjects - Whether to remove empty objects
 * @template RemoveEmptyArrays - Whether to remove empty arrays
 *
 * @param {T} input - The data to convert
 * @param {boolean} [removeEmptyObjects=false] - Remove empty objects `{}` if `true`
 * @param {boolean} [removeEmptyArrays=false] - Remove empty arrays `[]` if `true`
 *
 * @returns {ConvertedDeepNumber<T, RemoveEmptyObjects, RemoveEmptyArrays> | undefined}
 *          The transformed data, or `undefined` if entirely empty after processing.
 *
 * @example
 * toNumberDeep("123") // → 123
 * toNumberDeep("12.34") // → 12.34
 * toNumberDeep("not number") // → undefined
 *
 * @example
 * toNumberDeep([NaN, Infinity, -Infinity, "10"])
 * // → [10]
 *
 * @example
 * toNumberDeep({ a: {}, b: [] }, false, false)
 * // → { a: {}, b: [] }
 *
 * @example
 * toNumberDeep({ a: {}, b: [] }, true, false)
 * // → { b: [] }
 *
 * @example
 * toNumberDeep({ a: {}, b: [] }, false, true)
 * // → { a: {} }
 *
 * @example
 * toNumberDeep({ a: {}, b: [], c: { d: null } }, true, true)
 * // → {}
 *
 * @example
 * toNumberDeep({
 *   a: "1",
 *   b: {
 *     c: "not num",
 *     d: ["2", "3.5", null, { e: "4.4", f: "invalid" }],
 *   },
 *   g: [],
 * })
 * // → { a: 1, b: { d: [2, 3.5, { e: 4.4 }] }, g: [] }
 *
 * @example
 * toNumberDeep({ x: {}, y: [], z: [{ a: {}, b: [] }] }, false, true)
 * // → { x: {}, z: [{ a: {} }] }
 *
 * @example
 * toNumberDeep({ x: {}, y: [], z: [{ a: {}, b: [] }] }, true, false)
 * // → { y: [], z: [{ b: [] }] }
 *
 * @example
 * toNumberDeep({
 *   x: {},
 *   y: [],
 *   z: [{ a: {}, b: [], c: "3" }, { d: "4.5" }]
 * }, true, true)
 * // → { z: [{ c: 3 }, { d: 4.5 }] }
 *
 * @example
 * toNumberDeep([[[[[["1"]]], null]], "2", "abc"], false, true)
 * // → [[[[[[1]]]]], 2]
 *
 * @example
 * toNumberDeep(["1", {}, [], ["2", {}, []]], true, true)
 * // → [1, [2]]
 *
 * @example
 * toNumberDeep(["1", () => {}, Symbol("wow"), "2"])
 * // → [1, 2]
 *
 * @example
 * toNumberDeep({ a: { b: {} } }, false, true)
 * // → { a: { b: {} } }
 *
 * @example
 * toNumberDeep(["1", { a: {} }], true)
 * // → [1]
 *
 * @example
 * toNumberDeep(["1", { a: {} }], false)
 * // → [1, { a: {} }]
 *
 * @example
 * toNumberDeep(["1", [], { a: [] }], false, false)
 * // → [1, [], { a: [] }]
 */
export const toNumberDeep = <
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
  T extends unknown,
  RemoveEmptyObjects extends boolean = false,
  RemoveEmptyArrays extends boolean = false
>(
  input: T,
  removeEmptyObjects: RemoveEmptyObjects = false as RemoveEmptyObjects,
  removeEmptyArrays: RemoveEmptyArrays = false as RemoveEmptyArrays
):
  | ConvertedDeepNumber<T, RemoveEmptyObjects, RemoveEmptyArrays>
  | undefined => {
  function _toNumberDeepInternal<
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
    T extends unknown,
    RemoveEmptyObjects extends boolean,
    RemoveEmptyArrays extends boolean
  >(
    input: T,
    removeEmptyObjects: RemoveEmptyObjects,
    removeEmptyArrays: RemoveEmptyArrays,
    isRoot: boolean
  ): ConvertedDeepNumber<T, RemoveEmptyObjects, RemoveEmptyArrays> | undefined {
    if (isNil(input)) return undefined;

    if (!isBoolean(removeEmptyObjects) || !isBoolean(removeEmptyArrays)) {
      throw new TypeError(
        `props 'removeEmptyObjects' and 'removeEmptyArrays' must be \`boolean\` type!`
      );
    }

    if (isNumber(input) || (isString(input) && !isNaN(Number(input)))) {
      const num = Number(input);
      return (isFinite(num) ? num : undefined) as ConvertedDeepNumber<
        T,
        RemoveEmptyObjects,
        RemoveEmptyArrays
      >;
    }

    if (isArray(input)) {
      const newArray = input
        .map((item) =>
          _toNumberDeepInternal(
            item,
            removeEmptyObjects,
            removeEmptyArrays,
            false
          )
        )
        .filter((item) => !isUndefined(item));

      if (removeEmptyArrays && isEmptyArray(newArray)) return undefined;

      return newArray as ConvertedDeepNumber<
        T,
        RemoveEmptyObjects,
        RemoveEmptyArrays
      >;
    }

    if (isObject(input)) {
      const newObject: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(input)) {
        const convertedValue = _toNumberDeepInternal(
          value,
          removeEmptyObjects,
          removeEmptyArrays,
          false
        );
        if (!isUndefined(convertedValue)) {
          newObject[key] = convertedValue;
        }
      }

      if (removeEmptyObjects && Object.keys(newObject).length === 0) {
        return isRoot
          ? ({} as ConvertedDeepNumber<
              T,
              RemoveEmptyObjects,
              RemoveEmptyArrays
            >)
          : undefined;
      }

      return newObject as ConvertedDeepNumber<
        T,
        RemoveEmptyObjects,
        RemoveEmptyArrays
      >;
    }

    return undefined;
  }

  return _toNumberDeepInternal(
    input,
    removeEmptyObjects,
    removeEmptyArrays,
    true
  );
};
