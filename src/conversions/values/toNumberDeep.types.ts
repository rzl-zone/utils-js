/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { IntlObjects, TypedArray, WebApiObjects } from "@/types";

/** ----------------------------------------------------------
 * * Normalize leaked `never[]` into literal empty array `[]`.
 * ----------------------------------------------------------
 */
type FixNeverArray<T> = [T] extends [never[]] ? [] : T;

/** ----------------------------------------------------------
 * * Simplify object type to remove unnecessary TypeScript wrappers.
 * ----------------------------------------------------------
 */
type Simplify<T> = T extends object ? { [K in keyof T]: T[K] } : T;

/** ----------------------------------------------------------
 * * Deeply convert all numbers and strings to `number | undefined`,
 * * recursively handling arrays, tuples, Sets, Maps, TypedArrays,
 * * and objects. Special types like Date remain unchanged.
 * ----------------------------------------------------------
 *
 * @template T - Input type to convert
 * @template RemoveEmptyObjects - Whether to remove empty objects
 * @template RemoveEmptyArrays - Whether to remove empty arrays
 * @template IsRoot - Internal flag for root level
 */
type ConvertedDeepNumberInternal<
  T,
  RemoveEmptyObjects extends boolean,
  RemoveEmptyArrays extends boolean,
  IsRoot extends boolean
> =
  // Handle null or undefined
  [T] extends [null | undefined]
    ? IsRoot extends true
      ? undefined
      : never
    : // string, number or numeric string
    T extends number | `${number}` | string
    ? number | undefined
    : // Handle arrays and tuples
    T extends readonly (infer E)[]
    ? FixNeverArray<
        T extends readonly [any, ...any[]]
          ? _MapTuple<T, RemoveEmptyObjects, RemoveEmptyArrays>
          : ConvertedDeepNumberInternal<E, RemoveEmptyObjects, RemoveEmptyArrays, false>[]
      >
    : // Handle Set
    T extends Set<infer V>
    ? FixNeverArray<
        ConvertedDeepNumberInternal<V, RemoveEmptyObjects, RemoveEmptyArrays, false>[]
      >
    : // Handle Map
    T extends Map<infer K, infer V>
    ? FixNeverArray<
        [
          ConvertedDeepNumberInternal<K, RemoveEmptyObjects, RemoveEmptyArrays, false>,
          ConvertedDeepNumberInternal<V, RemoveEmptyObjects, RemoveEmptyArrays, false>
        ][]
      >
    : // Buffer
    T extends Buffer
    ? RemoveEmptyArrays extends true
      ? IsRoot extends true
        ? (number | undefined)[]
        : never
      : (number | undefined)[]
    : // Handle TypedArray
    T extends TypedArray
    ? FixNeverArray<
        ConvertedDeepNumberInternal<
          number,
          RemoveEmptyObjects,
          RemoveEmptyArrays,
          false
        >[]
      >
    : // Handle Date
    T extends Date
    ? _ConvertedObjectInternal<number, RemoveEmptyObjects, RemoveEmptyArrays, IsRoot>
    : // Handle built-in objects, Web/Intl/Node APIs
    T extends
        | RegExp
        | WebApiObjects
        | IntlObjects
        | { [Symbol.toStringTag]: "Proxy" }
        | typeof Reflect
    ? RemoveEmptyObjects extends true
      ? IsRoot extends true
        ? {} // root, keep as empty object
        : never // non-root, remove
      : {} // RemoveEmptyObjects = false, keep as empty object
    : // Handle plain objects
    T extends Record<string | number | symbol, unknown>
    ? _ConvertedObjectInternal<T, RemoveEmptyObjects, RemoveEmptyArrays, IsRoot>
    : never;

/** ----------------------------------------------------------
 * * Recursively map tuples while preserving `never` removals.
 * ----------------------------------------------------------
 */
type _MapTuple<
  Arr extends readonly unknown[],
  RemoveEmptyObjects extends boolean,
  RemoveEmptyArrays extends boolean
> = Arr extends readonly [infer H, ...infer R]
  ? Exclude<
      ConvertedDeepNumberInternal<H, RemoveEmptyObjects, RemoveEmptyArrays, false>,
      undefined
    > extends infer H2
    ? [H2] extends [never]
      ? _MapTuple<R, RemoveEmptyObjects, RemoveEmptyArrays>
      : [H2, ..._MapTuple<R, RemoveEmptyObjects, RemoveEmptyArrays>]
    : never
  : [];

/** ----------------------------------------------------------
 * * Internal object conversion utility.
 * * Removes empty objects/arrays based on flags.
 * ----------------------------------------------------------
 */
type _ConvertedObjectInternal<
  O extends Record<string | number | symbol, unknown> | number,
  RemoveEmptyObjects extends boolean,
  RemoveEmptyArrays extends boolean,
  IsRoot extends boolean
> = {
  [K in keyof O as Exclude<
    ConvertedDeepNumberInternal<O[K], RemoveEmptyObjects, RemoveEmptyArrays, false>,
    undefined
  > extends infer Convert
    ? [Convert] extends [never]
      ? never
      : undefined extends ConvertedDeepNumberInternal<
          O[K],
          RemoveEmptyObjects,
          RemoveEmptyArrays,
          false
        >
      ? never
      : RemoveEmptyArrays extends true
      ? Convert extends readonly unknown[]
        ? [Convert] extends [[]]
          ? O[K] extends TypedArray | Set<any> | Map<any, any>
            ? K
            : never
          : K
        : K
      : K
    : never]: Exclude<
    ConvertedDeepNumberInternal<O[K], RemoveEmptyObjects, RemoveEmptyArrays, false>,
    undefined
  >;
} & {
  [K in keyof O as Exclude<
    ConvertedDeepNumberInternal<O[K], RemoveEmptyObjects, RemoveEmptyArrays, false>,
    undefined
  > extends infer Convert
    ? [Convert] extends [never]
      ? never
      : undefined extends ConvertedDeepNumberInternal<
          O[K],
          RemoveEmptyObjects,
          RemoveEmptyArrays,
          false
        >
      ? RemoveEmptyArrays extends true
        ? Convert extends readonly unknown[]
          ? [Convert] extends [[]]
            ? O[K] extends TypedArray | Set<any> | Map<any, any>
              ? K
              : never
            : K
          : K
        : K
      : never
    : never]?: Exclude<
    ConvertedDeepNumberInternal<O[K], RemoveEmptyObjects, RemoveEmptyArrays, false>,
    undefined
  >;
} extends infer M
  ? RemoveEmptyObjects extends true
    ? keyof M extends never
      ? IsRoot extends true
        ? {}
        : never
      : Simplify<M>
    : Simplify<M>
  : never;

/** ----------------------------------------------------------
 * * Public type: Deeply converts numbers/strings to `number | undefined`,
 * * applies empty object/array removal, preserves special types.
 * ----------------------------------------------------------
 */
export type ConvertedDeepNumber<
  T,
  RemoveEmptyObjects extends boolean = false,
  RemoveEmptyArrays extends boolean = false
> = [unknown] extends [T]
  ? unknown
  : FixNeverArray<
      ConvertedDeepNumberInternal<T, RemoveEmptyObjects, RemoveEmptyArrays, true>
    >;
