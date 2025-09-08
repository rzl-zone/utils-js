/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { TypedArray, WebApiObjects, IntlObjects } from "@/types";

/** ----------------------------------------------------------
 * * Normalize leaked `never[]` into literal empty array `[]`.
 * ---------------------------------------------------------- */
type FixNeverArray<T, RemoveEmptyArrays extends boolean> = [T] extends [never[]]
  ? RemoveEmptyArrays extends true
    ? T extends undefined
      ? undefined
      : never
    : []
  : T;

/** ----------------------------------------------------------
 * * Simplify object type to remove unnecessary TypeScript wrappers.
 * ---------------------------------------------------------- */
type Simplify<T> = T extends object ? { [K in keyof T]: T[K] } : T;

/** ----------------------------------------------------------
 * * Deeply convert all numbers and numeric strings to `string`,
 * * recursively handling arrays, tuples, Sets, Maps, TypedArrays,
 * * Buffer, and objects. Special types like Date remain unchanged.
 * ---------------------------------------------------------- */
type ConvertedDeepStringInternal<
  T,
  RemoveEmptyObjects extends boolean,
  RemoveEmptyArrays extends boolean,
  IsRoot extends boolean
> = [T] extends [null | undefined]
  ? IsRoot extends true
    ? undefined
    : never
  : T extends
      | number
      | string
      | Date
      | RegExp
      | WebApiObjects
      | IntlObjects
      | { [Symbol.toStringTag]: "Proxy" }
      | typeof Reflect
  ? string
  : T extends readonly (infer E)[]
  ? FixNeverArray<
      T extends readonly [any, ...any[]]
        ? _MapTuple<T, RemoveEmptyObjects, RemoveEmptyArrays>
        : ConvertedDeepStringInternal<E, RemoveEmptyObjects, RemoveEmptyArrays, false>[],
      RemoveEmptyArrays
    >
  : T extends Set<infer V>
  ? FixNeverArray<
      ConvertedDeepStringInternal<V, RemoveEmptyObjects, RemoveEmptyArrays, false>[],
      RemoveEmptyArrays
    >
  : T extends Map<infer K, infer V>
  ? FixNeverArray<
      [
        ConvertedDeepStringInternal<K, RemoveEmptyObjects, RemoveEmptyArrays, false>,
        ConvertedDeepStringInternal<V, RemoveEmptyObjects, RemoveEmptyArrays, false>
      ][],
      RemoveEmptyArrays
    >
  : T extends Buffer
  ? FixNeverArray<
      ConvertedDeepStringInternal<string, RemoveEmptyObjects, RemoveEmptyArrays, false>[],
      RemoveEmptyArrays
    >
  : T extends TypedArray
  ? FixNeverArray<
      ConvertedDeepStringInternal<string, RemoveEmptyObjects, RemoveEmptyArrays, false>[],
      RemoveEmptyArrays
    >
  : T extends Record<string | number | symbol, unknown>
  ? _ConvertedObjectInternal<T, RemoveEmptyObjects, RemoveEmptyArrays, IsRoot>
  : never;

/** ----------------------------------------------------------
 * * Remove undefined and keep only items for tuples
 * ---------------------------------------------------------- */
type _MapTuple<
  Arr extends readonly unknown[],
  RemoveEmptyObjects extends boolean,
  RemoveEmptyArrays extends boolean
> = Arr extends readonly [infer H, ...infer R]
  ? Exclude<
      ConvertedDeepStringInternal<H, RemoveEmptyObjects, RemoveEmptyArrays, false>,
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
 * ---------------------------------------------------------- */
type _ConvertedObjectInternal<
  O extends Record<string | number | symbol, unknown> | string,
  RemoveEmptyObjects extends boolean,
  RemoveEmptyArrays extends boolean,
  IsRoot extends boolean
> = {
  [K in keyof O as Exclude<
    ConvertedDeepStringInternal<O[K], RemoveEmptyObjects, RemoveEmptyArrays, false>,
    undefined
  > extends infer Convert
    ? [Convert] extends [never]
      ? never
      : undefined extends ConvertedDeepStringInternal<
          O[K],
          RemoveEmptyObjects,
          RemoveEmptyArrays,
          false
        >
      ? never
      : RemoveEmptyArrays extends true
      ? Convert extends readonly unknown[]
        ? [Convert] extends [[]]
          ? never
          : K
        : K
      : K
    : never]: Exclude<
    ConvertedDeepStringInternal<O[K], RemoveEmptyObjects, RemoveEmptyArrays, false>,
    undefined
  >;
} & {
  [K in keyof O as Exclude<
    ConvertedDeepStringInternal<O[K], RemoveEmptyObjects, RemoveEmptyArrays, false>,
    undefined
  > extends infer Convert
    ? [Convert] extends [never]
      ? never
      : undefined extends ConvertedDeepStringInternal<
          O[K],
          RemoveEmptyObjects,
          RemoveEmptyArrays,
          false
        >
      ? RemoveEmptyArrays extends true
        ? Convert extends readonly unknown[]
          ? [Convert] extends [[]]
            ? never
            : K
          : K
        : K
      : never
    : never]?: Exclude<
    ConvertedDeepStringInternal<O[K], RemoveEmptyObjects, RemoveEmptyArrays, false>,
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
 * * Public type: Deeply converts numbers/strings to `string`,
 * * applies empty object/array removal, preserves special types.
 * ---------------------------------------------------------- */
export type ConvertedDeepString<
  T,
  RemoveEmptyObjects extends boolean = false,
  RemoveEmptyArrays extends boolean = false
> = [unknown] extends [T]
  ? unknown
  : FixNeverArray<
      Simplify<
        ConvertedDeepStringInternal<T, RemoveEmptyObjects, RemoveEmptyArrays, true>
      >,
      RemoveEmptyArrays
    >;
