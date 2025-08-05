/** ----------------------------------------------------------
 * * ***Checks whether a value is a symbol.***
 * ----------------------------------------------------------
 *
 * @param value - The value to check.
 * @returns `true` if the value is of type symbol.
 *
 * @example
 * isSymbol(Symbol("id"));         // true
 * isSymbol("not a symbol");       // false
 * isSymbol(123);                  // false
 * isSymbol(undefined);            // false
 */
export const isSymbol = (value: unknown): value is symbol => {
  return typeof value === "symbol";
};
