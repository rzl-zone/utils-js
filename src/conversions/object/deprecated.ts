import { isArray, isNull, isObject, isObjectOrArray } from "@/index";

type AllKeys<T> = T extends object
  ? T extends Array<infer U>
    ? keyof T | AllKeys<U>
    : keyof T | { [K in keyof T]: AllKeys<T[K]> }[keyof T]
  : never;

type DeleteKeyConfig<T> =
  | { deep?: false | undefined; key: keyof T }
  | { deep: true; key: AllKeys<T> };

/** ----------------------------------------------------------
 * * ***Dynamically deletes multiple keys from an object with optional deep deletion and cloning.***
 * ----------------------------------------------------------
 *
 * @deprecated Use `removeObjectPaths` instead
 *
 * - Supports both shallow and deep deletion in the same call.
 * - Works recursively with nested objects and arrays.
 * - The `deepClone` parameter allows you to choose:
 *   - If `true`, performs a deep clone before deletion, so the original object remains unchanged.
 *   - If `false` (default), it directly modifies the original object (mutation).
 *
 * @template T - The type of the input object.
 * @param {T} object - The source object to process.
 * @param {Array<{ key: keyof T | string; deep?: boolean }>} keysToDelete - List of keys to delete. If `deep` is `true`, the key will be removed recursively from nested structures.
 * @param {boolean} [deepClone=false] - Whether to deep clone the object before modifying. This prevents mutation on the original object.
 * @returns {Partial<T>} - The resulting object with the specified keys removed.
 *
 * @example
 * // Example 1: Using deepClone false (default) - object is mutated
 * const obj = { a: 1, b: { c: 2, d: 3 } };
 * const result = deleteObjMultipleDynamicDeprecated(obj, [{ key: "c", deep: true }]);
 * console.log(result); // { a: 1, b: { d: 3 } }
 * console.log(obj);    // { a: 1, b: { d: 3 } } -> original also changed
 *
 * @example
 * // Example 2: Using deepClone true - original object stays intact
 * const obj2 = { a: 1, b: { c: 2, d: 3 } };
 * const result2 = deleteObjMultipleDynamicDeprecated(obj2, [{ key: "c", deep: true }], true);
 * console.log(result2); // { a: 1, b: { d: 3 } }
 * console.log(obj2);    // { a: 1, b: { c: 2, d: 3 } } -> original untouched
 *
 * @example
 * // Example 3: Deep delete keys inside an array
 * const obj3 = {
 *   users: [
 *     { id: 1, name: "Alice", secret: "abc" },
 *     { id: 2, name: "Bob", secret: "xyz" }
 *   ]
 * };
 * const result3 = deleteObjMultipleDynamicDeprecated(obj3, [{ key: "secret", deep: true }]);
 * console.log(result3);
 * // Output: { users: [ { id: 1, name: "Alice" }, { id: 2, name: "Bob" } ] }
 *
 * @example
 * // Example 4: Shallow delete only top-level keys
 * const obj4 = {
 *   meta: { created: "2025-01-01" },
 *   data: { info: "sample" }
 * };
 * const result4 = deleteObjMultipleDynamicDeprecated(obj4, [{ key: "meta" }]);
 * console.log(result4); // { data: { info: "sample" } }
 * console.log(obj4);    // { data: { info: "sample" } }
 *
 * @example
 * // Example 5: Deep delete multiple keys in a complex nested structure
 * const obj5 = {
 *   meta: {
 *     id: "abc",
 *     details: { createdAt: "2025-01-01" }
 *   },
 *   items: [
 *     { id: 1, price: 100, secret: "hidden" },
 *     { id: 2, price: 200, secret: "hidden2" }
 *   ]
 * };
 * const result5 = deleteObjMultipleDynamicDeprecated(obj5, [
 *   { key: "details", deep: true },
 *   { key: "secret", deep: true }
 * ]);
 * console.log(result5);
 * // Output: {
 * //   meta: { id: "abc" },
 * //   items: [ { id: 1, price: 100 }, { id: 2, price: 200 } ]
 * // }
 */
export const removeObjectPathsDeprecated = <T extends Record<string, unknown>>(
  object: T,
  keysToDelete: DeleteKeyConfig<T>[],
  deepClone: boolean = false
): Partial<T> => {
  if (!isObjectOrArray(object) || isNull(object)) return {} as Partial<T>;

  if (
    !isArray(keysToDelete) ||
    !keysToDelete.every((k) => isObject(k) && "key" in k)
  ) {
    throw new TypeError(
      "Expected keysToDelete to be an array of { key, deep? } objects"
    );
  }

  const deepKeys = new Set(
    keysToDelete.filter((k) => k.deep).map((k) => k.key)
  );
  const shallowKeys = new Set(
    keysToDelete.filter((k) => !k.deep).map((k) => k.key)
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const process = (obj: any): any => {
    if (isArray(obj)) {
      return obj.map((item) =>
        isObjectOrArray(item) && !isNull(item) ? process(item) : item
      );
    } else if (isObject(obj) && !isNull(obj)) {
      for (const key of Object.keys(obj)) {
        if (shallowKeys.has(key)) {
          delete obj[key];
        } else if (deepKeys.has(key)) {
          delete obj[key];
        } else if (isObjectOrArray(obj[key]) && !isNull(obj[key])) {
          process(obj[key]);
        }
      }
    }
    return obj;
  };

  const target = deepClone ? structuredClone(object) : object;
  return process(target);
};
