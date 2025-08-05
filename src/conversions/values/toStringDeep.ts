import {
  isArray,
  isBoolean,
  isEmptyArray,
  isNil,
  isNumber,
  isObject,
  isString,
  isUndefined,
} from "@/predicates";

/** --------------------------------------------------
 * * ***Type utility to define the output type while maintaining structure.***
 * --------------------------------------------------
 *
 * - Converts number and string to `string`.
 * - Removes `null` and `undefined` values from objects and arrays.
 * - Keeps array/objects structure unless `removeEmptyObjects` or `removeEmptyArrays` is enabled.
 */
type ConvertedDeepString<
  T,
  RemoveEmptyObjects extends boolean,
  RemoveEmptyArrays extends boolean
> = T extends null | undefined
  ? never // Removes null & undefined
  : T extends number | string
  ? string // Convert number & string to string
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends any[]
  ? ConvertedDeepString<T[number], RemoveEmptyObjects, RemoveEmptyArrays>[] // Maintain array structure
  : T extends Record<string, unknown>
  ? {
      [K in keyof T]: ConvertedDeepString<
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

/**
 * --------------------------------------------------
 * * ***Converts all values in an array, object, or deeply nested structure to string.***
 * --------------------------------------------------
 *
 * - ✅ Converts number and string to string format (e.g., `123 → "123"`).
 * - ✅ Keeps existing string as string.
 * - ✅ Removes `null`, `undefined`, `NaN`, `Infinity`, `-Infinity`.
 * - ✅ Removes non-primitive types like functions, symbols, and bigints.
 * - ✅ Processes deeply nested arrays and objects.
 * - ✅ Supports removing empty objects `{}` and empty arrays `[]` via flags.
 *
 * @template T - The input data type (array, object, or any nested combination).
 * @template RemoveEmptyObjects - If `true`, empty objects `{}` will be removed recursively.
 * @template RemoveEmptyArrays - If `true`, empty arrays `[]` will be removed recursively.
 *
 * @param {T} input - The input array, object, or value to convert.
 * @param {boolean} [removeEmptyObjects=false] - Whether to remove empty objects `{}`.
 * @param {boolean} [removeEmptyArrays=false] - Whether to remove empty arrays `[]`.
 *
 * @returns {ConvertedDeepString<T, RemoveEmptyObjects, RemoveEmptyArrays> | undefined}
 *          The converted data structure with all values as string, or `undefined` if completely empty.
 *
 * @example
 * // Simple array conversion
 * toStringDeep([1, "2", 3])
 * // → ["1", "2", "3"]
 *
 * @example
 * // Nested arrays
 * toStringDeep([1, ["2", [3, [null, "4"]]]])
 * // → ["1", ["2", ["3", ["4"]]]]
 *
 * @example
 * // Object with nested values
 * toStringDeep({ a: 1, b: "2", c: { d: 3, e: null } })
 * // → { a: "1", b: "2", c: { d: "3" } }
 *
 * @example
 * // Removing empty objects
 * toStringDeep({ a: {}, b: "1" }, true, false)
 * // → { b: "1" }
 *
 * @example
 * // Removing empty arrays
 * toStringDeep(["1", [], { a: [] }], false, true)
 * // → ["1", { a: [] }]
 *
 * @example
 * // Removing both empty objects and arrays deeply
 * toStringDeep({ a: {}, b: [], c: [{ d: {}, e: [] }, "1"] }, true, true)
 * // → { c: ["1"] }
 *
 * @example
 * // Fully empty structure after processing becomes undefined
 * toStringDeep([null, undefined, {}], true, true)
 * // → undefined
 */
export const toStringDeep = <
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
  T extends unknown,
  RemoveEmptyObjects extends boolean = false,
  RemoveEmptyArrays extends boolean = false
>(
  input: T,
  removeEmptyObjects: RemoveEmptyObjects = false as RemoveEmptyObjects,
  removeEmptyArrays: RemoveEmptyArrays = false as RemoveEmptyArrays
):
  | ConvertedDeepString<T, RemoveEmptyObjects, RemoveEmptyArrays>
  | undefined => {
  function _toStringDeepInternal<
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
    T extends unknown,
    RemoveEmptyObjects extends boolean,
    RemoveEmptyArrays extends boolean
  >(
    input: T,
    removeEmptyObjects: RemoveEmptyObjects,
    removeEmptyArrays: RemoveEmptyArrays,
    isRoot: boolean
  ): ConvertedDeepString<T, RemoveEmptyObjects, RemoveEmptyArrays> | undefined {
    if (isNil(input)) return undefined;

    if (!isBoolean(removeEmptyObjects) || !isBoolean(removeEmptyArrays)) {
      throw new TypeError(
        `props 'removeEmptyObjects' and 'removeEmptyArrays' must be \`boolean\` type!`
      );
    }

    if (isNumber(input) || isString(input)) {
      return String(input) as ConvertedDeepString<
        T,
        RemoveEmptyObjects,
        RemoveEmptyArrays
      >;
    }

    if (isArray(input)) {
      const newArray = input
        .map((item) =>
          _toStringDeepInternal(
            item,
            removeEmptyObjects,
            removeEmptyArrays,
            false
          )
        )
        .filter((item) => !isUndefined(item));

      if (removeEmptyArrays && isEmptyArray(newArray)) return undefined;

      return newArray as ConvertedDeepString<
        T,
        RemoveEmptyObjects,
        RemoveEmptyArrays
      >;
    }

    if (isObject(input)) {
      const newObject: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(input)) {
        const convertedValue = _toStringDeepInternal(
          value,
          removeEmptyObjects,
          removeEmptyArrays,
          false
        );

        if (!isUndefined(convertedValue)) {
          newObject[key] = convertedValue;
        } else if (isArray(value) && !removeEmptyArrays) {
          // preserve empty array property
          newObject[key] = [];
        }
      }

      if (removeEmptyObjects && Object.keys(newObject).length === 0) {
        return isRoot
          ? ({} as ConvertedDeepString<
              T,
              RemoveEmptyObjects,
              RemoveEmptyArrays
            >)
          : undefined;
      }

      return newObject as ConvertedDeepString<
        T,
        RemoveEmptyObjects,
        RemoveEmptyArrays
      >;
    }

    return undefined;
  }

  return _toStringDeepInternal(
    input,
    removeEmptyObjects,
    removeEmptyArrays,
    true
  );
};
