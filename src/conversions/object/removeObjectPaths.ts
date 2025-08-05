import {
  isArray,
  isEmptyArray,
  isFunction,
  isNull,
  isObjectOrArray,
  isUndefined,
} from "@/predicates";
import type { ConfigRemoveObjectPaths } from "./removeObjectPaths.types";

const deepCloneSafe = <U>(obj: U): U => {
  try {
    if (isFunction(structuredClone)) {
      return structuredClone(obj);
    }
    // eslint-disable-next-line no-empty, @typescript-eslint/no-unused-vars
  } catch (_) {}
  return JSON.parse(JSON.stringify(obj));
};

const deleteShallowKey = <T extends Record<string, unknown>>(
  obj: T,
  key: string
) => {
  if (isObjectOrArray(obj) && !isNull(obj) && key in obj) {
    delete obj[key];
  }
  return obj;
};

const deleteNestedKey = <T extends Record<string, unknown>>(
  obj: T,
  path: string[]
): T => {
  if (!obj || typeof obj !== "object") return obj;

  const [currentKey, ...rest] = path;

  if (Array.isArray(obj)) {
    for (const item of obj) {
      if (isObjectOrArray(item) && !isNull(item)) {
        deleteNestedKey(item, path); // 💥 recursive pass same path
      }
    }
  } else if (isEmptyArray(rest)) {
    delete obj[currentKey];
  } else if (
    !isUndefined(obj[currentKey]) &&
    isObjectOrArray(obj[currentKey])
  ) {
    deleteNestedKey(obj[currentKey] as T, rest);
  }

  return obj;
};

/** ------------------------------------------------------------------------
 * * ***Deletes multiple keys (shallow or deeply nested) from an object.***
 * ------------------------------------------------------------------------
 *
 * ✅ Features:
 * - Removes one or more keys from an object based on their paths (supports dot notation for nested).
 * - Can delete deeply from all matching nested levels (even inside arrays) when `deep: true`.
 * - By default does **not mutate** the original object. Clones it first.
 *   Set `deepClone = false` to mutate in place (useful for performance on large data).
 * - Ensures type safety on `key` paths via `DotPath<T>`, reducing accidental invalid paths.
 *
 * 🔍 Behavior:
 * - When `deep: false` (default), only deletes the direct property at the specified path.
 * - When `deep: true`, searches deeply and recursively deletes the key from all levels,
 *   including inside arrays of objects (applies the *same* path repeatedly).
 * - Can delete nested properties safely without throwing even if intermediate objects are missing.
 *
 * 🚀 Edge Handling:
 * - Ignores invalid intermediate objects (will just skip that branch).
 * - If `object` is `null` or not an object, returns an empty object.
 * - Throws if `keysToDelete` is not a proper array of `{ key, deep? }` objects.
 *
 * @template T - The shape of the input object, used for type-safe dot paths.
 *
 * @param {T} object - The object to remove keys from. Must be an object or will return `{}`.
 * @param {Array<{ key: DotPath<T>, deep?: boolean }>} keysToDelete -
 *   An array of instructions:
 *   - `key`: A string path using dot notation (e.g. `"user.profile.name"`).
 *   - `deep`: If `true`, will recursively remove all instances of the key path at any depth.
 * @param {boolean} [deepClone=true] -
 *   Whether to deep clone the original object before modifying.
 *   - `true` (default): returns a *new object* with the specified keys removed.
 *   - `false`: modifies the original object in place and returns it.
 *
 * @returns {Partial<T>}
 *   - A new object with specified keys removed if `deepClone` is `true`.
 *   - The *same mutated object* if `deepClone` is `false`.
 *
 * @throws {TypeError}
 *   - If `object` is not an object.
 *   - If `keysToDelete` is not an array of `{ key, deep? }` objects.
 *
 * @example
 * // 🟢 Shallow deletion
 * removeObjectPaths(
 *   { a: 1, b: 2, c: { d: 3 } },
 *   [{ key: "b" }]
 * );
 * // => { a: 1, c: { d: 3 } }
 *
 * @example
 * // 🟢 Nested deletion (shallow, removes only exact path)
 * removeObjectPaths(
 *   { user: { profile: { name: "Alice", age: 30 } } },
 *   [{ key: "user.profile.age" }]
 * );
 * // => { user: { profile: { name: "Alice" } } }
 *
 * @example
 * // 🔥 Deep deletion (recursively removes key from all levels and arrays)
 * removeObjectPaths(
 *   { items: [{ price: 10 }, { price: 20, details: { price: 30 } }] },
 *   [{ key: "price", deep: true }]
 * );
 * // => { items: [{}, { details: {} }] }
 *
 * @example
 * // 📝 Without cloning: mutates original object
 * const obj = { x: 1, y: 2 };
 * removeObjectPaths(obj, [{ key: "y" }], false);
 * console.log(obj); // => { x: 1 }
 *
 * @example
 * // 🚫 Invalid usage throws
 * removeObjectPaths(42, [{ key: "a" }]);
 * // => throws TypeError
 */
export const removeObjectPaths = <T extends Record<string, unknown>>(
  object: T,
  keysToDelete: ConfigRemoveObjectPaths<T>[],
  deepClone: boolean = true
): Partial<T> => {
  if (!isObjectOrArray(object) || isNull(object)) return {} as Partial<T>;
  if (
    !isArray(keysToDelete) ||
    !keysToDelete.every((k) => isObjectOrArray(k) && "key" in k)
  ) {
    throw new TypeError(
      "Expected keysToDelete to be an array of { key, deep? } objects"
    );
  }

  let result: Partial<T> = deepClone ? deepCloneSafe(object) : object;

  for (const { key, deep } of keysToDelete) {
    const path = key.split(".");
    result = deep
      ? (deleteNestedKey(result, path) as Partial<T>)
      : (deleteShallowKey(result, path[0]) as Partial<T>);
  }

  return result;
};
