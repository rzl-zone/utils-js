import type { ConvertedDeepString } from "./toStringDeep.types";

import { isNil } from "@/predicates/is/isNil";
import { isSet } from "@/predicates/is/isSet";
import { isMap } from "@/predicates/is/isMap";
import { isDate } from "@/predicates/is/isDate";
import { isArray } from "@/predicates/is/isArray";
import { isBuffer } from "@/predicates/is/isBuffer";
import { isObject } from "@/predicates/is/isObject";
import { isRegExp } from "@/predicates/is/isRegExp";
import { isString } from "@/predicates/is/isString";
import { isNumber } from "@/predicates/is/isNumber";
import { isBoolean } from "@/predicates/is/isBoolean";
import { hasOwnProp } from "@/predicates/has/hasOwnProp";
import { isUndefined } from "@/predicates/is/isUndefined";
import { isEmptyArray } from "@/predicates/is/isEmptyArray";
import { isTypedArray } from "@/predicates/is/isTypedArray";
import { getPreciseType } from "@/predicates/type/getPreciseType";

import { assertIsPlainObject } from "@/assertions/objects/assertIsPlainObject";

type ToStringDeepOptions<
  RemoveEmptyObjects extends boolean = false,
  RemoveEmptyArrays extends boolean = false
> = {
  /** Whether to remove empty objects (`{}`) from the result.
   *
   * - `true` ➔ remove empty objects recursively.
   * - `false` **(default)** ➔ keep empty objects as-is.
   *
   * @default false
   */
  removeEmptyObjects?: RemoveEmptyObjects;
  /** Whether to remove empty arrays (`[]`) from the result.
   *
   * - `true` ➔ remove empty arrays recursively.
   * - `false` **(default)** ➔ keep empty arrays as-is.
   *
   * @default false
   */
  removeEmptyArrays?: RemoveEmptyArrays;
};

/** --------------------------------------------------
 * * ***Utility: `toStringDeep`.***
 * ---------------------------------------------------
 * **Converts all values in an array, object, Set, Map, or deeply nested structure to string.**
 * - **Features:**
 *    - Converts numbers and strings to string (e.g., `123` ➔ `"123"`).
 *    - Converts boolean to string (e.g., `true` ➔ `"true"`).
 *    - Converts Date to ISO string (`Date ➔ string`).
 *    - Converts RegExp to string (e.g., `/abc/ ➔ "/abc/"`).
 *    - Converts `Buffer`, `TypedArray`, `Set`, `Map`, and `arrays` recursively to `arrays of strings`.
 *    - Removes `null`, `undefined`, `NaN`, `Infinity`, `-Infinity`.
 *    - Removes `unsupported` types like `functions`, `symbols`, and `BigInt`.
 *    - Recursively processes nested `objects`, `arrays`, `Sets`, and `Maps`.
 *    - Can optionally remove empty arrays (`[]`) and/or empty objects (`{}`) **recursively**.
 * @template T - The input data type (`primitive`, `object`, `array`, `Set`, `Map`, or `any nested combination`).
 * @template RemoveEmptyObjects - If `true`, empty objects `{}` will be removed recursively.
 * @template RemoveEmptyArrays - If `true`, empty arrays `[]` will be removed recursively (including arrays nested in `objects` / `arrays` / `Sets` / `Maps`).
 * @param {*} input - The data to convert.
 * @param {ToStringDeepOptions<RemoveEmptyObjects, RemoveEmptyArrays>} [options] - Conversion options.
 * @returns {ConvertedDeepString<T, RemoveEmptyObjects, RemoveEmptyArrays>|undefined}
 * The transformed data, or `undefined` if the entire structure becomes empty after processing.
 * @example
 * ```ts
 * // Simple array conversion
 * toStringDeep([1, "2", 3]);
 * // ➔ ["1", "2", "3"]
 *
 * // Simple top-level conversion
 * toStringDeep(123);
 * // ➔ "123"
 * toStringDeep("123");
 * // ➔ "123"
 * toStringDeep(true);
 * // ➔ "true"
 * toStringDeep(false);
 * // ➔ "false"
 *
 * // Nested arrays
 * toStringDeep([1, ["2", [3, [null, "4", true, false]]]]);
 * // ➔ ["1", ["2", ["3", ["4", "true", "false"]]]]
 *
 * // Object with nested values
 * toStringDeep({ a: 1, b: "2", c: { d: 3, e: null, f: true, g: false } });
 * // ➔ { a: "1", b: "2", c: { d: "3", f: "true", g: "false" } }
 *
 * // Removing empty objects
 * toStringDeep({ a: {}, b: "1" }, { removeEmptyObjects: true });
 * // ➔ { b: "1" }
 *
 * // Removing empty arrays recursively
 * toStringDeep(["1", [], { a: [] }], { removeEmptyArrays: true });
 * // ➔ ["1", { a: [] }]
 *
 * // Removing both empty objects and arrays recursively
 * toStringDeep({ a: {}, b: [], c: [{ d: {}, e: [] }, "1"] }, {
 *   removeEmptyObjects: true,
 *   removeEmptyArrays: true
 * });
 * // ➔ { c: ["1"] }
 *
 * // Fully empty structure becomes undefined
 * toStringDeep([null, undefined, {}], {
 *   removeEmptyObjects: true,
 *   removeEmptyArrays: true
 * });
 * // ➔ undefined
 * ```
 */
export function toStringDeep(
  input?: null | undefined,
  options?: ToStringDeepOptions<boolean, boolean>
): undefined;
export function toStringDeep<
  T,
  RemoveEmptyObjects extends boolean = false,
  RemoveEmptyArrays extends boolean = false
>(
  input: T,
  options?: ToStringDeepOptions<RemoveEmptyObjects, RemoveEmptyArrays>
): ConvertedDeepString<T, RemoveEmptyObjects, RemoveEmptyArrays>;
export function toStringDeep<
  T,
  RemoveEmptyObjects extends boolean = false,
  RemoveEmptyArrays extends boolean = false
>(input: T, options: ToStringDeepOptions<RemoveEmptyObjects, RemoveEmptyArrays> = {}) {
  assertIsPlainObject(options, {
    message: ({ currentType, validType }) =>
      `Second parameter (\`options\`) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });

  const removeEmptyObjects = hasOwnProp(options, "removeEmptyObjects")
    ? options.removeEmptyObjects
    : false;
  const removeEmptyArrays = hasOwnProp(options, "removeEmptyArrays")
    ? options.removeEmptyArrays
    : false;

  function _internal<
    T,
    RemoveEmptyObjects extends boolean,
    RemoveEmptyArrays extends boolean
  >(
    input: T,
    options: Required<ToStringDeepOptions<RemoveEmptyObjects, RemoveEmptyArrays>> & {
      isRoot: boolean;
    }
  ): ConvertedDeepString<T, RemoveEmptyObjects, RemoveEmptyArrays> | undefined {
    if (isNil(input) || input === Infinity || input === -Infinity) return undefined;

    const { removeEmptyArrays, removeEmptyObjects, isRoot } = options;

    if (!isBoolean(removeEmptyObjects) || !isBoolean(removeEmptyArrays)) {
      throw new TypeError(
        `Parameters \`removeEmptyObjects\` and \`removeEmptyArrays\` property of the \`options\` (second parameter) must be of type \`boolean\`, but received: ['removeEmptyObjects': \`${getPreciseType(
          removeEmptyObjects
        )}\`, 'removeEmptyArrays': \`${getPreciseType(removeEmptyArrays)}\`].`
      );
    }

    if (isNumber(input) || isString(input) || isBoolean(input)) {
      return String(input) as ConvertedDeepString<
        T,
        RemoveEmptyObjects,
        RemoveEmptyArrays
      >;
    }

    if (isDate(input)) {
      return input.toISOString() as ConvertedDeepString<
        T,
        RemoveEmptyObjects,
        RemoveEmptyArrays
      >;
    }

    if (isRegExp(input)) {
      return input.toString() as ConvertedDeepString<
        T,
        RemoveEmptyObjects,
        RemoveEmptyArrays
      >;
    }

    if (isBuffer(input)) {
      return Array.from(input)
        .map((v) => String(v))
        .filter((v) => !isUndefined(v)) as ConvertedDeepString<
        T,
        RemoveEmptyObjects,
        RemoveEmptyArrays
      >;
    }

    if (isTypedArray(input)) {
      // If BigInt TypedArray
      if (input instanceof BigInt64Array || input instanceof BigUint64Array) {
        const newArray = Array.from(input)
          .map((item) =>
            _internal(item, {
              removeEmptyObjects,
              removeEmptyArrays,
              isRoot: false
            })
          )
          .map((v) => String(v))
          .filter((item) => !isUndefined(item));

        if (removeEmptyArrays && isEmptyArray(newArray)) return undefined;
        return newArray as ConvertedDeepString<T, RemoveEmptyObjects, RemoveEmptyArrays>;
      } else {
        // All TypedArray based of number
        const newArray = Array.from(input)
          .map((item) =>
            _internal(item, {
              removeEmptyObjects,
              removeEmptyArrays,
              isRoot: false
            })
          )
          .map((v) => String(v))
          .filter((item) => !isUndefined(item));

        if (removeEmptyArrays && isEmptyArray(newArray)) return undefined;
        return newArray as ConvertedDeepString<T, RemoveEmptyObjects, RemoveEmptyArrays>;
      }
    }

    if (isSet(input)) {
      const arr = Array.from(input)
        .map((v) =>
          _internal(v, { removeEmptyObjects, removeEmptyArrays, isRoot: false })
        )
        .filter((v) => !isUndefined(v));
      if (removeEmptyArrays && isEmptyArray(arr)) return undefined;
      return arr as ConvertedDeepString<T, RemoveEmptyObjects, RemoveEmptyArrays>;
    }

    // Map ➔ array of [key, value]
    if (isMap(input)) {
      const arr = Array.from(input.entries())
        .map(([k, v]) => [
          _internal(k, { removeEmptyObjects, removeEmptyArrays, isRoot: false }),
          _internal(v, { removeEmptyObjects, removeEmptyArrays, isRoot: false })
        ])
        .filter(([k, v]) => !isUndefined(k) && !isUndefined(v));
      if (removeEmptyArrays && isEmptyArray(arr)) return undefined;
      return arr as ConvertedDeepString<T, RemoveEmptyObjects, RemoveEmptyArrays>;
    }

    if (isArray(input)) {
      let newArray = input
        .map((item) =>
          _internal(item, {
            removeEmptyObjects,
            removeEmptyArrays,
            isRoot: false
          })
        )
        .filter((item) => !isUndefined(item));

      // remove empty arrays recursively
      if (removeEmptyArrays) {
        newArray = newArray.filter((v) => !(isArray(v) && v.length === 0));
      }

      if (removeEmptyArrays && isEmptyArray(newArray)) return undefined;
      return newArray as ConvertedDeepString<T, RemoveEmptyObjects, RemoveEmptyArrays>;
    }

    if (isObject(input)) {
      const newObject: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(input)) {
        const convertedValue = _internal(value, {
          removeEmptyObjects,
          removeEmptyArrays,
          isRoot: false
        });

        if (!isUndefined(convertedValue)) {
          newObject[key] = convertedValue;
        } else if (isArray(value) && !removeEmptyArrays) {
          // preserve empty array property
          newObject[key] = [];
        }
      }

      if (removeEmptyObjects && Object.keys(newObject).length === 0) {
        return isRoot
          ? ({} as ConvertedDeepString<T, RemoveEmptyObjects, RemoveEmptyArrays>)
          : undefined;
      }

      return newObject as ConvertedDeepString<T, RemoveEmptyObjects, RemoveEmptyArrays>;
    }

    return undefined;
  }

  return _internal(input, {
    removeEmptyObjects,
    removeEmptyArrays,
    isRoot: true
  });
}
