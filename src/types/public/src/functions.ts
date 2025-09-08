/** --------------------------------------------------
 * * ***AnyFunction.***
 * --------------------------------------------------
 * A generic type representing **any function**
 * with any arguments and any return type.
 *
 * @example
 * const fn: AnyFunction = (a, b) => a + b;
 * fn(1, 2);
 * // ➔ 3
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFunction = (...args: any[]) => any;
