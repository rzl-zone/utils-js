import type { And } from "./and";
import type { Extends } from "./extends";
import type { Prettify } from "./prettify";

/** ---------------------------------------------------------------------------
 * * ***Options for {@link Mutable | `Mutable`}.***
 * ---------------------------------------------------------------------------
 * **Configuration options for the ***{@link Mutable | **`Mutable`**}*** type utilities.**
 * @example
 * ```ts
 * type Opt1 = MutableOptions;
 * // ➔ { recursive: boolean }
 * ```
 */
export type MutableOptions = {
  /** * ***Whether to make nested objects mutable recursively.***
   *
   * - **Behavior:**
   *    - If `true`, all nested objects will also have their `readonly` removed.
   *    - Default value: `false`.
   *
   * @default false
   */
  recursive: boolean;
};

/** -------------------------------------------------------
 * * ***Utility Type: `Mutable`.***
 * -------------------------------------------------------
 * **Removes `readonly` from all properties of the passed type `T`.**
 * - If `Options["recursive"]` is `true`, nested objects are also made mutable.
 * @template T - The type to make mutable.
 * @template Options - Configuration options. Default: `{ recursive: false }`.
 * @example
 * ```ts
 * type Case1 = Mutable<{ readonly a: { readonly b: string } }>;
 * // ➔ { a: { b: string } } (non-recursive by default)
 * type Case2 = Mutable<{ readonly a: { readonly b: string } }, { recursive: true }>;
 * // ➔ { a: { b: string } } (nested properties also mutable)
 * ```
 */
export type Mutable<T, Options extends MutableOptions = { recursive: false }> = Prettify<{
  -readonly [K in keyof T]: And<Options["recursive"], Extends<T[K], object>> extends true
    ? Mutable<T[K], Options>
    : T[K];
}>;

/** -------------------------------------------------------
 * * ***Utility Type: `MutableOnly`.***
 * -------------------------------------------------------
 * **Removes `readonly` only from the specified keys `K` of type `T`.**
 * @template T - The type to modify.
 * @template K - Keys to make mutable.
 * @example
 * ```ts
 * type Case1 = MutableOnly<{ readonly a: string; readonly b: string }, "a">;
 * // ➔ { a: string; readonly b: string }
 * type Case2 = MutableOnly<{ readonly a: string; readonly b: string }, "a" | "b">;
 * // ➔ { a: string; b: string }
 * ```
 */
export type MutableOnly<T, K extends keyof T> = Prettify<
  Pick<T, Exclude<keyof T, K>> & {
    -readonly [P in K]: T[P];
  }
>;

/** -------------------------------------------------------
 * * ***Utility Type: `MutableExcept`.***
 * -------------------------------------------------------
 * **Removes `readonly` from all properties of `T` **except** the specified keys `K`.**
 * @template T - The type to modify.
 * @template K - Keys to keep as readonly.
 * @example
 * ```ts
 * type Case1 = MutableExcept<{ readonly a: string; readonly b: string }, "b">;
 * // ➔ { a: string; readonly b: string }
 * type Case2 = MutableExcept<{ a: string; readonly b: string }, "a">;
 * // ➔ { a: string; b: string } (all except "a" made mutable)
 * ```
 */
export type MutableExcept<T, K extends keyof T> = Prettify<
  Pick<T, K> & {
    -readonly [P in Exclude<keyof T, K>]: T[P];
  }
>;
