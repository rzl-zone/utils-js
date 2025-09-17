import type { Prettify } from "./prettify";

/** --------------------------------------------------
 * * ***Utility Type: `OmitStrict`.***
 * --------------------------------------------------
 * **Strictly omits keys `K` from type `T`, with optional flattening for readability using `Prettify`.**
 * - **Behavior:**
 *    - ✅ Enhances autocomplete and type inspection clarity in editors.
 *    - ✅ Optionally flattens nested intersections or mapped types into a cleaner shape.
 * @template T - The original object type.
 * @template K - The keys to omit from `T`.
 * @template WithPrettify - Whether to prettify the result (default is `true`).
 * @template WithPrettifyRecursive - Whether to prettify nested object properties recursively (default is `true`).
 * @example
 * ```ts
 * type A = { a: number; b: string; c: boolean };
 * type B = OmitStrict<A, 'b'>;
 * // ➔ { a: number; c: boolean }
 *
 * type C = OmitStrict<A, 'b', false>;
 * // ➔ Omit without prettifying, keeps intersection structure
 *
 * type D = OmitStrict<A, 'b', true, false>;
 * // ➔ Prettifies only top level, does not recurse into nested objects
 * ```
 */
export type OmitStrict<
  T,
  K extends keyof T,
  WithPrettify extends boolean = true,
  WithPrettifyRecursive extends boolean = true
> = WithPrettify extends true
  ? Prettify<
      Omit<T, K>,
      { recursive: WithPrettifyRecursive extends boolean ? WithPrettifyRecursive : false }
    >
  : WithPrettify extends false
  ? Omit<T, K>
  : never;
