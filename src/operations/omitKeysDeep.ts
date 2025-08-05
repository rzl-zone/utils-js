import {
  findDuplicates,
  isArray,
  isEmptyArray,
  isNonEmptyArray,
  isNull,
  isObject,
  isUndefined,
} from "@/index";

type DotPath<T, Prev extends string = ""> = T extends Array<infer U>
  ? DotPath<U, `${Prev}${Prev extends "" ? "" : "."}${number}`>
  : T extends object
  ? {
      [K in keyof T & string]:
        | `${Prev}${Prev extends "" ? "" : "."}${K}`
        | DotPath<T[K], `${Prev}${Prev extends "" ? "" : "."}${K}`>;
    }[keyof T & string]
  : never;

/** ------------------------------------------------------
 * * Recursively omits properties from an object using dot notation paths.
 * * Also removes resulting empty objects (`{}`) and arrays (`[]`),
 * * cascading upwards to remove empty parents until root if needed.
 * ------------------------------------------------------
 *
 * @template I - Type of the input object
 *
 * @param {I} object
 *    The object to process. Should be a plain nested object or array structure.
 *
 * @param {DotPath<I>[]} keysToOmit
 *    An array of string paths in dot notation indicating the properties to remove.
 *    Paths can include numeric indices to target array elements, e.g. `"arr.0.x"` to remove `x`
 *    from the first object inside the `arr` array.
 *
 * @returns {Partial<I>}
 *    A new deeply cloned object with the specified keys omitted,
 *    with resulting empty objects or arrays fully removed (even if it collapses to `{}`).
 *
 * @throws {TypeError}
 *    If `keysToOmit` is not an array will throw TypeError.
 *
 * @throws {Error}
 *    If `keysToOmit` contains duplicate paths will throw Error.
 *
 * @remarks
 * ⚠️ Be careful: if after omission an object or array becomes empty, it will be removed entirely
 * including all the way up to the root if necessary, resulting in `{}`.
 *
 * @example
 * omitKeysDeep({ a: { b: { c: 1 }, d: 2 }, e: 3 }, ["a.b.c"]);
 * // → { a: { d: 2 }, e: 3 }
 *
 * @example
 * omitKeysDeep({ a: [{ b: 1 }, { c: 2 }] }, ["a.0.b"]);
 * // → { a: [{ c: 2 }] }
 *
 * @example
 * omitKeysDeep({ a: [{ b: 1 }] }, ["a.0.b"]);
 * // → {} (array becomes empty and removed)
 *
 * @example
 * omitKeysDeep({ complex: [{ deep: [{ x: 1, y: 2 }] }] }, ["complex.0.deep.0.x"]);
 * // → { complex: [{ deep: [{ y: 2 }] }] }
 *
 * @example
 * omitKeysDeep({ complex: [{ deep: [{ x: 1 }] }] }, ["complex.0.deep.0.x"]);
 * // → {} (deep chain emptied and collapsed)
 *
 * @example
 * omitKeysDeep({ data: [[{ foo: 1, bar: 2 }]] }, ["data.0.0.foo"]);
 * // → { data: [[{ bar: 2 }]] }
 *
 * @example
 * omitKeysDeep({ data: [[{ foo: 1 }]] }, ["data.0.0.foo"]);
 * // → {} (nested arrays emptied completely)
 *
 * @example
 * omitKeysDeep({ x: [{ y: [{ z: 1 }, { w: 2 }] }] }, ["x.0.y.0.z"]);
 * // → { x: [{ y: [{ w: 2 }] }] }
 *
 * @example
 * omitKeysDeep({ x: [{ y: [{ z: 1 }] }] }, ["x.0.y.0.z"]);
 * // → {} (entire nested arrays removed)
 *
 * @example
 * omitKeysDeep({ p: { q: { r: 5 } }, s: 6 }, ["p.q.r"]);
 * // → { s: 6 } (`p` removed because it becomes empty)
 *
 * @example
 * omitKeysDeep({ arr: [{ a: 1, b: 2 }, { c: 3 }] }, ["arr.0.a"]);
 * // → { arr: [{ b: 2 }, { c: 3 }] }
 *
 * @example
 * omitKeysDeep({ root: [{ sub: [{ leaf: 10 }] }] }, ["root.0.sub.0.leaf"]);
 * // → {} (deep nested arrays emptied to root)
 *
 * @example
 * omitKeysDeep({ meta: { tags: ["x", "y"], count: 2 } }, ["meta.count"]);
 * // → { meta: { tags: ["x", "y"] } }
 *
 * @example
 * omitKeysDeep({ arr: [[{ a: 1 }, { b: 2 }]] }, ["arr.0.0.a"]);
 * // → { arr: [[{ b: 2 }]] }
 *
 * @example
 * omitKeysDeep({ arr: [[{ a: 1 }]] }, ["arr.0.0.a"]);
 * // → {} (double nested emptied)
 *
 * @example
 * omitKeysDeep({ nested: [{ list: [{ id: 1, val: 2 }] }] }, ["nested.0.list.0.val"]);
 * // → { nested: [{ list: [{ id: 1 }] }] }
 *
 * @example
 * omitKeysDeep({ nested: [{ list: [{ id: 1 }] }] }, ["nested.0.list.0.id"]);
 * // → {} (full collapse to empty)
 *
 * @example
 * omitKeysDeep({ mixed: { a: [1, 2, 3], b: { c: 4 } } }, ["mixed.b.c"]);
 * // → { mixed: { a: [1, 2, 3] } }
 */
export const omitKeysDeep = <I extends Record<string, unknown>>(
  object: I,
  keysToOmit: DotPath<I>[]
): Partial<I> => {
  if (!isObject(object)) return {} as Partial<I>;

  if (!isArray(keysToOmit)) {
    throw new TypeError("Expected 'keysToOmit' to be a 'array' type");
  }

  const duplicates = findDuplicates(keysToOmit);
  if (isNonEmptyArray(duplicates)) {
    throw new Error(
      `Function "omitKeysDeep" Error: Duplicate keys detected - ${duplicates}`
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const omitAtPath = (obj: any, pathParts: string[]): any => {
    if (!obj || typeof obj !== "object") return obj;

    const [current, ...rest] = pathParts;

    if (isEmptyArray(rest)) {
      if (isArray(obj)) {
        // Support numeric index
        const index = parseInt(current);
        if (!isNaN(index) && index in obj) {
          obj.splice(index, 1);
        }
      } else {
        delete obj[current];
      }
    } else {
      const next = obj[current];
      if (isArray(next) || (typeof next === "object" && !isNull(next))) {
        obj[current] = omitAtPath(next, rest);
      }
    }
    return obj;
  };

  const deepRemoveEmptyObjects = (obj: unknown): Partial<I> => {
    if (isArray(obj)) {
      return obj
        .map<unknown>(deepRemoveEmptyObjects)
        .filter(
          (item) =>
            !(
              typeof item === "object" &&
              !isNull(item) &&
              Object.keys(item).length === 0
            )
        ) as unknown as Partial<I>;
    }
    if (obj && typeof obj === "object") {
      const cleaned = Object.fromEntries(
        Object.entries(obj)
          .map(([k, v]) => [k, deepRemoveEmptyObjects(v)])
          .filter(
            ([, v]) =>
              !isUndefined(v) &&
              !(
                typeof v === "object" &&
                !isNull(v) &&
                Object.keys(v).length === 0
              )
          )
      );
      return cleaned;
    }
    return obj as Partial<I>;
  };

  const result = JSON.parse(JSON.stringify(object)); // clone deep to avoid mutating original
  for (const key of keysToOmit) {
    const parts = key.split(".");
    omitAtPath(result, parts);
  }

  return deepRemoveEmptyObjects(result) as Partial<I>;
};
