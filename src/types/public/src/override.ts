import type { OmitStrict } from "./omit";

/** --------------------------------------------------
 * * ***Utility Type: `OverrideTypes`.***
 * --------------------------------------------------
 * **Overrides properties in type `T` with properties from type `U`, based on matching keys.**
 * - ✅ Ensures the result retains all properties from `T`, but values from `U` override corresponding keys.
 * @template T - The base object type to override.
 * @template U - The object type containing overriding properties.
 * @example
 * ```ts
 * type A = { a: number; b: string };
 * type B = { b: boolean };
 * type C = OverrideTypes<A, B>;
 * // ➔ { a: number; b: boolean }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type OverrideTypes<T, U extends Partial<Record<keyof T, unknown>>> = OmitStrict<
  T,
  Extract<keyof U, keyof T>
> &
  U extends infer U
  ? { [K in keyof U]: U[K] }
  : never;
