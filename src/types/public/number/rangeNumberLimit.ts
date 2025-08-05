import type { Sum, IsGreaterThan } from "@/types";

/** --------------------------------------------------
 * * ***Generate a union type of numbers within a specified range.***
 * --------------------------------------------------
 *
 * @template From Starting number of the range (inclusive).
 * @template To Ending number of the range (inclusive).
 * @template Result Accumulator for recursion (internal use).
 *
 * @description
 * Generates a numeric union type from `From` to `To` (inclusive).
 * Maximum `To` supported is `999` to avoid
 * `"Type instantiation is excessively deep and possibly infinite.ts(2589)"`.
 *
 * Example:
 * ```ts
 * type MyRange = RangeNumberLimit<5, 8>;
 * // => 5 | 6 | 7 | 8
 * ```
 */
export type RangeNumberLimit<
  From extends number,
  To extends number,
  Result extends number[] = [From]
> = IsGreaterThan<From, To> extends true
  ? [...Result, To][number] extends infer R extends number
    ? R extends R
      ? IsGreaterThan<R, To> extends true
        ? never
        : R
      : never
    : never
  : RangeNumberLimit<
      Sum<From, 7>,
      To,
      [
        ...Result,
        From,
        Sum<From, 1>,
        Sum<From, 2>,
        Sum<From, 3>,
        Sum<From, 4>,
        Sum<From, 5>,
        Sum<From, 6>
      ]
    >;
