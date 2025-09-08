import type { And, AndArr } from "./and";
import type { IsEqual } from "./equal";
import type { Extends } from "./extends";
import type { IsNever } from "./never";
import type { Not } from "./not";
import type { Or } from "./or";
import type { Prettify } from "./prettify";
import type { IsUnknown } from "./unknown";

/** -------------------------------------------------------
 * * ***OverWritable***
 * -------------------------------------------------------
 *
 * Option type to signal that some properties can be overwritten
 * when applying default options.
 *
 * @property overwriteDefault - If true, all options in the passed `Options`
 *   object will **overwrite** defaults, even if rules say otherwise.
 */
export type OverWritable = {
  /**
   * If true, all options in the passed `Options` object will **overwrite** defaults, even if rules say otherwise, defaultValue: `false`.
   *
   * @default false
   */
  overwriteDefault?: boolean;
};

/** -------------------------------------------------------
 * * ***ApplyDefaultOptions***
 * -------------------------------------------------------
 *
 * @deprecated  ⚠️ ***Internal utility only. Do **not** use directly in application code***.
 *
 * Type-level utility that merges a user-specified `Options` object
 * with a `DefaultOptions` object using a set of `OverwriteRules`.
 *
 * @template BaseOptions - The base type of all options.
 * @template Options - User-specified options that may override defaults.
 * @template DefaultOptions - Default values for options.
 * @template OverwriteRules - A mapping that indicates which keys
 *   should always allow overwriting defaults.
 * @template OverwriteDefault - If true, all options in `Options`
 *   overwrite defaults regardless of rules.
 *
 * @remarks
 * - Recursively applies defaults for nested objects.
 * - Only objects that are non-nullable and non-unknown are recursively merged.
 * - If a property is **not an object** or recursion is not needed,
 *   it either takes the value from `Options` or merges `Options[K] | DefaultOptions[K]`.
 * - Helps safely build strongly typed configuration objects with defaults.
 *
 * @example
 * ```ts
 * type Base = {
 *   a: { x: number; y: string };
 *   b: boolean;
 * };
 *
 * type Defaults = {
 *   a: { x: 1; y: "default" };
 *   b: true;
 * };
 *
 * type UserOptions = {
 *   a: { y: "custom" };
 * };
 *
 * type Result = ApplyDefaultOptions<Base, UserOptions, Defaults, { a: true; b: false }>;
 * // Result: {
 * //   a: { x: 1; y: "custom"; tra: "test" };
 * //   b: boolean;
 * // }
 * ```
 *
 */
export type ApplyDefaultOptions<
  BaseOptions,
  Options extends BaseOptions,
  DefaultOptions extends BaseOptions,
  OverwriteRules,
  OverwriteDefault extends boolean = false
> = Prettify<{
  [K in keyof BaseOptions]-?: K extends keyof Options
    ? AndArr<
        [
          Extends<NonNullable<BaseOptions[K]>, object>,
          Not<IsNever<DefaultOptions[K]>>,
          Not<IsUnknown<BaseOptions[K]>>
        ]
      > extends true
      ? ApplyDefaultOptions<
          NonNullable<BaseOptions[K]>,
          // Options[K],
          Extract<Options[K], NonNullable<BaseOptions[K]>>,
          // DefaultOptions[K],
          Extract<DefaultOptions[K], NonNullable<BaseOptions[K]>>,
          OverwriteRules[K & keyof OverwriteRules],
          OverwriteDefault
        > & {
          tra: "test";
        }
      : Or<
          IsEqual<OverwriteDefault, true>,
          And<
            Extends<K, keyof OverwriteRules>,
            Extends<OverwriteRules[K & keyof OverwriteRules], true>
          >
        > extends true
      ? Options[K]
      : Options[K] | DefaultOptions[K]
    : DefaultOptions[K];
}>;
