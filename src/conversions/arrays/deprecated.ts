import { isArray, isBoolean, isNumber, isString } from "@/index";

/**
 * @deprecated Use `dedupeArray` Instead.
 */
export const dedupeArrayDeprecated = <T extends boolean>(
  inputArray: unknown[],
  forceToString: T = false as T
): T extends true ? string[] : Array<string | number> => {
  if (!isArray(inputArray)) {
    throw new TypeError(`props 'inputArray' must be \`array\` type!`);
  }

  if (!isBoolean(forceToString)) {
    throw new TypeError(`props 'forceToString' must be \`boolean\` type!`);
  }

  // Recursive function to flatten nested arrays
  const flattenArray = (input: unknown[]): Array<string | number> => {
    return input.reduce<Array<string | number>>((acc, item) => {
      if (isArray(item)) {
        acc.push(...flattenArray(item));
      } else if (isString(item) || isNumber(item)) {
        acc.push(forceToString ? String(item) : item);
      } else {
        throw new TypeError(
          "Array must contain only strings, numbers, or nested arrays."
        );
      }
      return acc;
    }, []);
  };

  // Flatten the input array and remove duplicates while preserving order
  const flatArray = flattenArray(inputArray);

  return [
    ...new Map(flatArray.map((item) => [item, item])).values(),
  ] as T extends true ? string[] : Array<string | number>;
};
