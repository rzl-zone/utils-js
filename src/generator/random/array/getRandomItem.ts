import { isNonEmptyArray } from "@/index";

/** ---------------------------------
 * * ***Returns a random element from a given array.***
 * ---------------------------------
 *
 * @template T The type of elements in the array (string | number).
 * @param {T[]} array - The input array.
 * @returns {T | undefined} A random element from the array, or `undefined` if the array is empty or invalid.
 *
 * @example
 * getRandomItem([1, 2, 3, 4]); // Returns a random number from the array
 * getRandomItem(["apple", "banana", "cherry"]); // Returns a random string from the array
 * getRandomItem([]); // Returns `undefined`
 */
export const getRandomItem = <T extends string | number>(
  array?: T[]
): T | undefined => {
  if (!isNonEmptyArray(array)) return undefined;

  const randomIndex = Math.floor(Math.random() * (array.length || 0));
  return array[randomIndex];
};
