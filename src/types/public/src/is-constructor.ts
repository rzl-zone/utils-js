/* eslint-disable @typescript-eslint/no-explicit-any */

/** -------------------------------------------------------
 * * ***Utility Type: `IsConstructor`.***
 * -------------------------------------------------------
 * **Checks if a given type `T` is a constructor type (`new () => any`).**
 * @template T - The type to check.
 * @returns `true` if `T` is a constructor, otherwise `false`.
 * @example
 * class MyClass {}
 * type A = IsConstructor<typeof MyClass>;
 * // ➔ true
 * type B = IsConstructor<() => void>;
 * // ➔ false
 */
export type IsConstructor<T> = T extends abstract new (...args: any[]) => any
  ? true
  : false;
