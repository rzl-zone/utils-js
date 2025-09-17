import type { Prettify } from "./prettify";

/** -------------------------------------------------------
 * * ***Utility Type: `ReadonlyOnly`.***
 * -------------------------------------------------------
 * **Makes the specified keys `K` of an object type `T` readonly,
 * while leaving the other properties mutable.**
 * @template T - The object type.
 * @template K - Keys of `T` to make readonly.
 * @example
 * ```ts
 * type T0 = ReadonlyOnly<{ a: string; b: number }, 'a'>;
 * // ➔ { readonly a: string; b: number }
 *
 * type T1 = ReadonlyOnly<{ x: boolean; y: number; z: string }, 'y' | 'z'>;
 * // ➔ { x: boolean; readonly y: number; readonly z: string }
 * ```
 */
export type ReadonlyOnly<T extends object, K extends keyof T> = Prettify<
  Pick<T, Exclude<keyof T, K>> & {
    readonly [P in K]: T[P];
  }
>;

/** -------------------------------------------------------
 * * ***Utility Type: `ReadonlyExcept`.***
 * -------------------------------------------------------
 * **Makes all properties of an object type `T` readonly,
 * except for the specified keys `K` which remain mutable.**
 * @template T - The object type.
 * @template K - Keys of `T` to remain mutable.
 * @example
 * ```ts
 * type T0 = ReadonlyExcept<{ a: string; b: number }, 'a'>;
 * // ➔ { a: string; readonly b: number }
 *
 * type T1 = ReadonlyExcept<{ x: boolean; y: number; z: string }, 'x' | 'z'>;
 * // ➔ { x: boolean; readonly y: number; z: string }
 * ```
 */
export type ReadonlyExcept<T extends object, K extends keyof T> = Prettify<
  Pick<T, K> & {
    readonly [P in Exclude<keyof T, K>]: T[P];
  }
>;
