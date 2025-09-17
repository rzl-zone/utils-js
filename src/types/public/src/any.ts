/* eslint-disable @typescript-eslint/no-explicit-any */
import type { If } from "./if";

/** -------------------------------------------------------
 * * ***Utility Type: `IsAny`.***
 * -------------------------------------------------------
 * **A type-level utility that checks whether a type is ***`any`***.**
 * - **Behavior:**
 *    - Returns `true` if `T` is `any`.
 *    - Returns `false` for otherwise.
 * @template T - The type to evaluate.
 * @example
 * ```ts
 * type A = IsAny<any>;     // ➔ true
 * type B = IsAny<string>;  // ➔ false
 * type C = IsAny<unknown>; // ➔ false
 * type D = IsAny<never>;   // ➔ false
 * ```
 */
export type IsAny<T> = 0 extends 1 & T ? true : false;

/** -------------------------------------------------------
 * * ***Utility Type: `IfAny`.***
 * -------------------------------------------------------
 * **A type-level conditional utility that returns one type if ***`T` is `any`***,
 * and another type otherwise.**
 * - **Behavior:**
 *    - Defaults to `true` when `T` is `any`.
 *    - Defaults to `false` for otherwise.
 * @template T - The type to check.
 * @template IfTrue - The type to return if `T` is `any`, *(default: `true`)*.
 * @template IfFalse - The type to return if `T` is not `any`, *(default: `false`)*.
 * @example
 * ```ts
 * type A = IfAny<any, string, number>;
 * // ➔ string
 * type B = IfAny<string, string, number>;
 * // ➔ number
 * ```
 */
export type IfAny<T, IfTrue = true, IfFalse = false> = If<IsAny<T>, IfTrue, IfFalse>;

/** * ***Configuration options for a type-level utility for
 * {@link AnifyProperties | `AnifyProperties`}.***
 */
export type AnifyPropertiesOptions = {
  /** If `makeOptional: true`, all properties become optional, otherwise, all properties are required and typed as `any`, defaultValue: `false`.
   *
   * @default false
   */
  makeOptional: boolean;
};

/** -------------------------------------------------------
 * * ***Utility Type: `AnifyProperties`.***
 * -------------------------------------------------------
 * **A type-level utility that transforms all properties of an object
 * into ***`any`***.**
 * - **Behavior:**
 *    - If `makeOptional: true`, all properties become optional.
 *    - Otherwise, all properties are required and typed as `any`.
 * @template T The object type to transform.
 * @template Options Configuration options, defaults to `{ makeOptional: false }`.
 * @example
 * ```ts
 * type A = AnifyProperties<{a: string; b: number}>;
 * // ➔ { a: any; b: any }
 * type B = AnifyProperties<{a: string; b: number}, { makeOptional: true }>;
 * // ➔ { a?: any; b?: any }
 * ```
 */
export type AnifyProperties<
  T extends object,
  Options extends AnifyPropertiesOptions = { makeOptional: false }
> = {
  [K in keyof T]: any;
} extends infer Result
  ? If<Options["makeOptional"], Partial<Result>, Result>
  : never;
