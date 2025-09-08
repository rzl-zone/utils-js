import { IsEqual } from "./equal";
import { Multi } from "./multi";
import { Push } from "./push";

type _Pow<
  Num extends number,
  Factor extends number,
  CurrentProduct extends number = 1,
  Iteration extends unknown[] = []
> = IsEqual<Iteration["length"], Factor> extends true
  ? CurrentProduct
  : _Pow<Num, Factor, Multi<CurrentProduct, Num>, Push<Iteration, unknown>>;

/** -------------------------------------------------------
 * * ***Pow.***
 * -------------------------------------------------------
 *
 * Returns a type-level **exponentiation** result: raises the first integer parameter (`Num`)
 * to the power of the second integer parameter (`Factor`).
 *
 * @template Num - The base number (integer).
 * @template Factor - The exponent number (integer, >= 0).
 *
 * @example
 * ```ts
 * // 100
 * type Case1 = Pow<10, 2>
 *
 * // 1
 * type Case2 = Pow<5, 0>
 *
 * // 8
 * type Case3 = Pow<2, 3>
 * ```
 */
export type Pow<Num extends number, Factor extends number> = _Pow<Num, Factor>;
