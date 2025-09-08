import type { ApplyDefaultOptions, OverWritable } from "./_internal";
import type { And } from "./and";
import type { ArrayElementType } from "./array-element-type";
import type { IsEqual } from "./equal";
import type { AnyFunction } from "./functions";
import type { Increment } from "./increment";
import type { IsArrayIndex } from "./is-array-index";
import type { IsTuple } from "./is-tuple";
import type { Join } from "./join";
import type { IsNever } from "./never";
import type { ValueOf, ValueOfArray } from "./value-of";

/** --------------------------------------------------------------
 * * ***Options for {@link PathToFields} type-level utility.***
 * --------------------------------------------------------------
 *
 * @template ignoredTypes - Types to ignore completely.
 * @template stopTypes - Types at which recursion stops and returns `[]`.
 * @template limit - Max recursion depth.
 * @template format - Output format, `"dot"` or `"array"`.
 * @template ignoredKeys - Keys to ignore when generating paths.
 * @template arrayIndexing - Options for handling array paths.
 */
export type PathToFieldsOptions = OverWritable & {
  ignoredTypes?: unknown;
  stopTypes?: unknown;
  limit?: number;
  format?: "dot" | "array";
  ignoredKeys?: PropertyKey;
  arrayIndexing?: {
    exactIndexes: boolean;
  };
};
/** * ***Default options for {@link PathToFields}.*** */
export type DefaultPathToFieldsOptions = {
  ignoredTypes: never;
  stopTypes: string | number | boolean | symbol | Date | AnyFunction;
  format: "dot";
  limit: 10;
  ignoredKeys: never;
  arrayIndexing: {
    exactIndexes: false;
  };
};

type OverwriteRules = {
  limit: true;
  format: true;
  arrayIndexing: {
    exactIndexes: true;
  };
};

type Booleanize<T> = T extends true ? true : false;

type _PathToFieldsArray<
  T extends readonly unknown[],
  Options extends PathToFieldsOptions,
  Iteration extends number = 0
> = And<
  IsTuple<T>,
  IsEqual<
    Booleanize<Options["arrayIndexing"] extends { exactIndexes: infer E } ? E : false>,
    true
  >
> extends true
  ? ValueOfArray<{
      [K in keyof T]: IsArrayIndex<K> extends true
        ? [K, ..._PathToFields<T[K], Options, Increment<Iteration>>]
        : never;
    }>
  : ArrayElementType<T> extends infer ElementType
  ? [
      `${number}`,
      ...(ElementType extends ElementType
        ? _PathToFields<ElementType, Options, Increment<Iteration>>
        : never)
    ]
  : never;

type _PathToFields<
  T,
  Options extends PathToFieldsOptions,
  Iteration extends number = 0
> = T extends Options["ignoredTypes"]
  ? never
  : T extends Options["stopTypes"]
  ? []
  : IsEqual<Iteration, Options["limit"]> extends true
  ? never
  : T extends readonly unknown[]
  ? _PathToFieldsArray<T, Options, Iteration>
  : ValueOf<{
      [K in Exclude<keyof T, symbol | Options["ignoredKeys"]>]: NonNullable<
        T[K]
      > extends infer NonNullableFields
        ? NonNullableFields extends readonly unknown[]
          ? [K, ..._PathToFieldsArray<NonNullableFields, Options, Iteration>]
          : [K, ..._PathToFields<NonNullableFields, Options, Increment<Iteration>>]
        : never;
    }>;

/** -------------------------------------------------------
 * * ***PathToFields.***
 * -------------------------------------------------------
 *
 * Generates **all possible property paths** within a type `T`.
 * Supports nested objects, arrays, tuples, and optional configuration.
 *
 * @template T - Object type to extract paths from.
 * @template Options - Optional configuration. See {@link PathToFieldsOptions}.
 *
 * @example
 * ```ts
 * // Nested object
 * type T1 = PathToFields<{ a: { b: { c: number } } }>;
 * // Result: "a.b.c"
 *
 * // Array of objects (dot notation, default)
 * type T2 = PathToFields<{ arr: { id: string; value: number }[] }>;
 * // Result: "arr.${number}.id" | "arr.${number}.value"
 *
 * // Output format as array of path segments
 * type T4 = PathToFields<
 *   { user: { profile: { name: string } } },
 *   { format: "array" }
 * >;
 * // Result: ["user", "profile", "name"]
 *
 * // Ignoring specific keys
 * type T5 = PathToFields<
 *   { id: string; password: string; profile: { bio: string } },
 *   { ignoredKeys: "password" }
 * >;
 * // Result: "id" | "profile.bio"
 *
 * // Stopping recursion at specific types
 * type T6 = PathToFields<
 *   { settings: Date; nested: { inner: number } },
 *   { stopTypes: Date }
 * >;
 * // Result: "settings" | "nested.inner"
 * ```
 *
 * @remarks
 * - `Options.format = "dot"` → dot-notation strings, default output (`"a.b.c"`).
 * - `Options.format = "array"` → array of path segments (`["a", "b", "c"]`).
 * - `Options.limit` → max recursion depth (default 10).
 * - `Options.stopTypes` → types at which recursion stops.
 * - `Options.ignoredTypes` → types ignored completely.
 * - `Options.ignoredKeys` → keys to skip when generating paths.
 * - `Options.arrayIndexing.exactIndexes = true` → outputs exact tuple indexes (`"arr.0"`), otherwise generic `"arr.${number}"`.
 */
export type PathToFields<
  T,
  Options extends PathToFieldsOptions & { overwriteDefault?: boolean } = never
> = (
  IsNever<Options> extends true
    ? DefaultPathToFieldsOptions
    : ApplyDefaultOptions<
        Omit<PathToFieldsOptions, keyof OverWritable>,
        Options,
        DefaultPathToFieldsOptions,
        OverwriteRules,
        PathToFieldsOptions["overwriteDefault"] extends boolean
          ? PathToFieldsOptions["overwriteDefault"]
          : false
      >
) extends infer MergedOptions extends PathToFieldsOptions
  ? _PathToFields<T, MergedOptions> extends infer Paths extends readonly (
      | string
      | number
    )[]
    ? IsEqual<MergedOptions["format"], "dot"> extends true
      ? Paths extends Paths
        ? Join<Paths, ".">
        : never
      : Paths
    : never
  : never;
