type Enumerate<
  N extends number,
  Acc extends number[] = []
> = Acc["length"] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc["length"]]>;

/** --------------------------------------------------
 * * ***Generate a union type of numbers within a specific range from `1` to `999`.***
 * --------------------------------------------------
 *
 * @template From Starting number of the range (inclusive).
 * @template To Ending number of the range (inclusive).
 *
 * @description
 * Produces a union of numbers from `From` to `To` (inclusive).
 * Maximum `From` or `To` supported is `999` to prevent
 * `"Type instantiation is excessively deep and possibly infinite.ts(2589)"`.
 *
 * @example
 * type Range = RangeNumberTo999<3, 6>;
 * // => 3 | 4 | 5 | 6
 */
export type RangeNumberTo999<
  From extends number,
  To extends number
> = From extends To
  ? From
  : Exclude<Enumerate<To>, Enumerate<From>> extends never
  ? never
  : Exclude<Enumerate<To>, Enumerate<From>> | To;

// _________________________
