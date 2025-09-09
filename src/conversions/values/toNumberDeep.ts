import type { ConvertedDeepNumber } from "./toNumberDeep.types";

import { isNaN } from "@/predicates/is/isNaN";
import { isSet } from "@/predicates/is/isSet";
import { isMap } from "@/predicates/is/isMap";
import { isNil } from "@/predicates/is/isNil";
import { isDate } from "@/predicates/is/isDate";
import { isArray } from "@/predicates/is/isArray";
import { isFinite } from "@/predicates/is/isFinite";
import { isBuffer } from "@/predicates/is/isBuffer";
import { isNumber } from "@/predicates/is/isNumber";
import { isObject } from "@/predicates/is/isObject";
import { isBoolean } from "@/predicates/is/isBoolean";
import { hasOwnProp } from "@/predicates/has/hasOwnProp";
import { isUndefined } from "@/predicates/is/isUndefined";
import { isEmptyArray } from "@/predicates/is/isEmptyArray";
import { isTypedArray } from "@/predicates/is/isTypedArray";
import { isEmptyObject } from "@/predicates/is/isEmptyObject";
import { getPreciseType } from "@/predicates/type/getPreciseType";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";
import { assertIsPlainObject } from "@/assertions/objects/assertIsPlainObject";

type ToNumberDeepOptions<
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
 * * ***Utility: `toNumberDeep`.***
 * ---------------------------------------------------
 * **Converts deeply nested arrays, objects, buffers, sets, maps, or typed arrays into numbers while preserving structure.**
 * - **Features:**
 *    - Removes `null`, `undefined`, `NaN`, `Infinity`, `-Infinity`, empty-string, non-numeric strings, and functions.
 *    - Recursively processes `nested objects`, `arrays`, `buffers`, `sets`, `maps`, and `typed arrays`.
 *    - Converts numeric strings to numbers (e.g., `"3.5"` ➔ `3.5`).
 *    - Keeps empty objects `{}` unless `removeEmptyObjects: true`.
 *    - Keeps empty arrays `[]` unless `removeEmptyArrays: true`.
 *    - `Buffers` and `TypedArrays` are converted into `arrays of numbers`.
 *    - `Date objects` are converted into their timestamp (`number`).
 * @template T - The input type.
 * @template RemoveEmptyObjects - Whether to remove empty objects.
 * @template RemoveEmptyArrays - Whether to remove empty arrays.
 * @param {*} input - The input value to convert.
 * @param {ToNumberDeepOptions<RemoveEmptyObjects, RemoveEmptyArrays>} [options] - Conversion options.
 * @returns {ConvertedDeepNumber<T, RemoveEmptyObjects, RemoveEmptyArrays>|undefined} The converted value, return `undefined` if the input is entirely empty or filtered out by options.
 * @example
 * ```ts
 * toNumberDeep("123");
 * // ➔ 123
 * toNumberDeep("abc");
 * // ➔ undefined
 * toNumberDeep([NaN, "10", "xyz"]);
 * // ➔ [10]
 * toNumberDeep({ a: "1", b: [null, "2"] });
 * // ➔ { a: 1, b: [2] }
 * toNumberDeep(Buffer.from([0, 1, 2]));
 * // ➔ [0, 1, 2]
 * toNumberDeep(new Set(["1", "2"]));
 * // ➔ [1, 2]
 * toNumberDeep(new Map([["a", "1"], ["b", "2"]]));
 * // ➔ [["a", 1], ["b", 2]]
 * toNumberDeep(new Int16Array([1, 2, 3]));
 * // ➔ [1, 2, 3]
 * toNumberDeep(new Date("2025-08-16T00:00:00Z"));
 * // ➔ 1755552000000
 * toNumberDeep({ a: {}, b: [] }, { removeEmptyObjects: true });
 * // ➔ { b: [] }
 * toNumberDeep({ a: {}, b: [] }, { removeEmptyArrays: true });
 * // ➔ { a: {} }
 * toNumberDeep({ x: {}, y: [], z: [{ a: {}, b: [] }] }, {
 *    removeEmptyObjects: true, removeEmptyArrays: true
 * });
 * // ➔ { z: [] }
 * ```
 */
export function toNumberDeep(
  input?: null | undefined,
  options?: ToNumberDeepOptions<boolean, boolean>
): undefined;
export function toNumberDeep<
  T,
  RemoveEmptyObjects extends boolean = false,
  RemoveEmptyArrays extends boolean = false
>(
  input: T,
  options?: ToNumberDeepOptions<RemoveEmptyObjects, RemoveEmptyArrays>
): ConvertedDeepNumber<T, RemoveEmptyObjects, RemoveEmptyArrays>;
export function toNumberDeep<
  T,
  RemoveEmptyObjects extends boolean = false,
  RemoveEmptyArrays extends boolean = false
>(input: T, options: ToNumberDeepOptions<RemoveEmptyObjects, RemoveEmptyArrays> = {}) {
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
    options: Required<ToNumberDeepOptions<RemoveEmptyObjects, RemoveEmptyArrays>> & {
      isRoot: boolean;
    }
  ): ConvertedDeepNumber<T, RemoveEmptyObjects, RemoveEmptyArrays> | undefined {
    if (isNil(input)) return undefined;

    const { removeEmptyArrays, removeEmptyObjects, isRoot } = options;

    if (!isBoolean(removeEmptyObjects) || !isBoolean(removeEmptyArrays)) {
      throw new TypeError(
        `Parameters \`removeEmptyObjects\` and \`removeEmptyArrays\` property of the \`options\` (second parameter) must be of type \`boolean\`, but received: ['removeEmptyObjects': \`${getPreciseType(
          removeEmptyObjects
        )}\`, 'removeEmptyArrays': \`${getPreciseType(removeEmptyArrays)}\`].`
      );
    }

    // primitive numbers or numeric strings
    if (isNumber(input) || (isNonEmptyString(input) && !isNaN(Number(input)))) {
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
          _internal(item, {
            removeEmptyObjects,
            removeEmptyArrays,
            isRoot: false
          })
        )
        .filter((item) => !isUndefined(item));

      if (removeEmptyArrays && isEmptyArray(newArray)) return undefined;
      return newArray as ConvertedDeepNumber<T, RemoveEmptyObjects, RemoveEmptyArrays>;
    }

    if (isSet(input)) {
      const newArray = Array.from(input)
        .map((item) =>
          _internal(item, {
            removeEmptyObjects,
            removeEmptyArrays,
            isRoot: false
          })
        )
        .filter((item) => !isUndefined(item));

      if (removeEmptyArrays && isEmptyArray(newArray)) return undefined;
      return newArray as ConvertedDeepNumber<T, RemoveEmptyObjects, RemoveEmptyArrays>;
    }

    if (isMap(input)) {
      let newArray = Array.from(input.entries())
        .map(([k, v]) => {
          const key = _internal(k, {
            removeEmptyObjects,
            removeEmptyArrays,
            isRoot: false
          });
          const value = _internal(v, {
            removeEmptyObjects,
            removeEmptyArrays,
            isRoot: false
          });
          return !isUndefined(key) && !isUndefined(value) ? [key, value] : undefined;
        })
        .filter((item) => !isUndefined(item));

      // remove empty arrays recursively
      if (removeEmptyArrays) {
        newArray = newArray.filter((v) => !(isArray(v) && v.length === 0));
      }

      if (removeEmptyArrays && isEmptyArray(newArray)) return undefined;
      return newArray as ConvertedDeepNumber<T, RemoveEmptyObjects, RemoveEmptyArrays>;
    }

    if (isBuffer(input)) {
      const arr = Array.from(input)
        .map((n) =>
          _internal(n, {
            removeEmptyObjects,
            removeEmptyArrays,
            isRoot: false
          })
        )
        .filter((item) => !isUndefined(item));
      if (removeEmptyArrays && isEmptyArray(arr)) return undefined;
      return arr as ConvertedDeepNumber<T, RemoveEmptyObjects, RemoveEmptyArrays>;
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
          .filter((item) => !isUndefined(item));

        if (removeEmptyArrays && isEmptyArray(newArray)) return undefined;
        return newArray as ConvertedDeepNumber<T, RemoveEmptyObjects, RemoveEmptyArrays>;
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
          .filter((item) => !isUndefined(item));

        if (removeEmptyArrays && isEmptyArray(newArray)) return undefined;
        return newArray as ConvertedDeepNumber<T, RemoveEmptyObjects, RemoveEmptyArrays>;
      }
    }

    if (isDate(input)) {
      return (!isNaN(input.getTime()) ? input.getTime() : 0) as ConvertedDeepNumber<
        T,
        RemoveEmptyObjects,
        RemoveEmptyArrays
      >;
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
        }
      }

      if (removeEmptyObjects && isEmptyObject(newObject)) {
        return isRoot
          ? ({} as ConvertedDeepNumber<T, RemoveEmptyObjects, RemoveEmptyArrays>)
          : undefined;
      }

      return newObject as ConvertedDeepNumber<T, RemoveEmptyObjects, RemoveEmptyArrays>;
    }

    return undefined;
  }

  return _internal(input, {
    removeEmptyObjects,
    removeEmptyArrays,
    isRoot: true
  }) as ConvertedDeepNumber<T, RemoveEmptyObjects, RemoveEmptyArrays>;
}
