import { findDuplicates, isArray, isNonEmptyArray } from "@/index";

/** --------------------------------
 * * Removes Property from PROPS Collection
 * --------------------------------
 * @description Becarefull put array in arrayException, If array is duplicated it will be throw an exception error
 * @param object is Record as object (string,any)
 * @param arrayExcept is Array exception []
 * @returns
 *
 * @deprecated - Use `omitKeys` instead, this function will remove a next update.
 */
export const omitProps = <
  I extends Record<string, unknown>,
  S extends (keyof I)[]
>(
  object: I,
  arrayExcept: S
) => {
  if (!isArray(arrayExcept)) {
    throw new TypeError("Expected 'arrayExcept' to be a 'array' type");
  }

  const duplicates = findDuplicates(arrayExcept);
  if (isNonEmptyArray(duplicates)) {
    throw new Error(
      `Function omitProps Error, cause Duplicate of arrayExcept: ${String(
        duplicates
      )}`
    );
  }

  if (object) {
    const filteredEntries = Object.entries(object).filter(
      ([key]) => !arrayExcept.includes(key as keyof I)
    );
    return Object.fromEntries(filteredEntries) as Omit<I, S[number]>;
  }

  return;
};
