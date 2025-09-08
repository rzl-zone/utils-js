import type {
  AnyFunction,
  FixNeverArrayRecursive,
  NormalizeEmptyArraysRecursive,
  RemoveEmptyArrayElements
} from "@/types";

//! Start: `filterNilArray`

type ExcludeNil<T> = Exclude<T, null | undefined>;

/** ----------------------------------------------------------
 *  * ***Element extractor***
 * ----------------------------------------------------------
 */
type ElementOf<A extends readonly unknown[]> = A extends readonly (infer U)[] ? U : never;

/** ----------------------------------------------------------
 * * ***Compute `FilterNilArray`***
 * ----------------------------------------------------------
 *
 * for a tuple/array A by using the element type (without null|undefined).
 *
 */
export type FilterNilArrayFromTuple<A extends readonly unknown[]> = FilterNilArray<
  ExcludeNil<ElementOf<A>>
>;

/** ----------------------------------------------------------
 * ***Preserve `mutability`: if A is mutable (extends unknown[]), keep B; otherwise make B readonly***. */
export type PreserveMutability<A extends readonly unknown[], B> = A extends unknown[]
  ? B
  : Readonly<B>;

type IsDeepEmptyArray<T> = T extends readonly []
  ? true
  : T extends readonly (infer U)[]
  ? IsDeepEmptyArray<U>
  : false;

type FilterNilRecursive<T> = T extends readonly (infer U)[]
  ? T extends (infer U)[]
    ? FilterNilRecursive<ExcludeEmptyArray<U>>[]
    : readonly FilterNilRecursive<ExcludeEmptyArray<U>>[]
  : Exclude<T, null | undefined>;
type ExcludeEmptyArray<T> = T extends [] ? never : T;

type NormalizerArrays<T> = NormalizeEmptyArraysRecursive<
  RemoveEmptyArrayElements<FilterNilRecursive<T[]>>
>;
export type FilterNilArray<T> = IsDeepEmptyArray<NormalizerArrays<T>> extends true
  ? []
  : FixNeverArrayRecursive<NormalizerArrays<T>>;

//! End: `filterNilArray`

//? ----------------------

//! Start: `dedupeArray`
type ResUnFTN<Force extends false | "stringOrNumber" | "primitives" | "all" = false> =
  Force extends "all"
    ? Array<unknown[] | Record<string, unknown> | string>
    : Force extends "stringOrNumber"
    ? Array<
        | string
        | boolean
        | bigint
        | symbol
        | null
        | undefined
        | Record<string, unknown>
        | AnyFunction
        | unknown[]
        | Date
        | RegExp
        | Map<unknown, unknown>
        | Set<unknown>
        | Promise<unknown>
      >
    : Force extends "primitives"
    ? Array<
        | string
        | symbol
        | Record<string, unknown>
        | AnyFunction
        | unknown[]
        | Date
        | RegExp
        | Map<unknown, unknown>
        | Set<unknown>
        | Promise<unknown>
      >
    : Force extends false
    ? Array<
        | string
        | number
        | bigint
        | boolean
        | symbol
        | RegExp
        | Record<string, unknown>
        | AnyFunction
        | Date
        | Map<unknown, unknown>
        | Set<unknown>
        | Promise<unknown>
        | unknown[]
        | null
        | undefined
      >
    : unknown[];

type ResFTN<Force extends false | "stringOrNumber" | "primitives" | "all" = false> =
  Force extends "all"
    ? Array<string | Record<string, unknown>>
    : Force extends "stringOrNumber"
    ? Array<
        | string
        | boolean
        | bigint
        | symbol
        | null
        | undefined
        | Record<string, unknown>
        | AnyFunction
        | Date
        | RegExp
        | Promise<unknown>
      >
    : Force extends "primitives"
    ? Array<
        | string
        | symbol
        | RegExp
        | Record<string, unknown>
        | AnyFunction
        | Date
        | Promise<unknown>
      >
    : Force extends false
    ? Array<
        | string
        | number
        | bigint
        | boolean
        | symbol
        | RegExp
        | Record<string, unknown>
        | AnyFunction
        | Date
        | Promise<unknown>
        | null
        | undefined
      >
    : unknown[];

export type DedupeResult<
  Force extends ForceToStringOptions = false,
  FTN extends boolean = false
> = FTN extends false ? ResUnFTN<Force> : ResFTN<Force>;
export type ForceToStringOptions = false | "stringOrNumber" | "primitives" | "all";
export type DedupeArrayOptions<F extends ForceToStringOptions, Fl extends boolean> = {
  /** Enables string conversion for comparison, default is `false`.
   *
   * @default false
   * @type {ForceToStringOptions}
   */
  forceToString?: F;
  /** If true, deeply flattens arrays, Maps, and Sets before deduplication, default is `false`.
   *
   * @default false
   */
  flatten?: Fl;
};

//! End: `dedupeArray`
