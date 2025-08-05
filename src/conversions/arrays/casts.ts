import {
  isArray,
  isBoolean,
  filterNullArray,
  isObject,
  isString,
  isNumber,
  isNull,
} from "@/index";

//  ** ---- array number to array string ----

/** ---------------------------------------------
 * * ***Converts all values in an array from numbers or other types to strings.***
 * * ***The function can also remove invalid values (null, undefined) based on the options provided.***
 * ---------------------------------
 *
 * * 🚫 Note: This function does NOT support recursive or nested arrays.
 *   It only processes a flat array of values.
 *
 * * Use `toStringDeep` if you want to recursive.
 * ---------------------------------------------
 *
 * @param {Array<string | number | null | undefined>} [array] - The array to be transformed.
 * @param {Object} [options] - The options object that controls the transformation behavior.
 * @param {boolean} [options.removeInvalidValue=true] - If true, removes invalid values (null, undefined) from the result. Default is true.
 * @returns {Array<string | null | undefined>} - A new array with string representations of the values or an array with invalid values removed if specified.
 *
 * @example
 * toStringArrayUnRecursive([1, 2, '3'])
 * // => ['1', '2', '3']
 *
 * @example
 * toStringArrayUnRecursive([1, null, undefined, 'abc'], { removeInvalidValue: true })
 * // => ['1', 'abc']
 *
 * @example
 * toStringArrayUnRecursive([1, null, undefined, 'abc'], { removeInvalidValue: false })
 * // => ['1', null, undefined, 'abc']
 *
 * @example
 * toStringArrayUnRecursive(undefined)
 * // => undefined
 */
export function toStringArrayUnRecursive(
  array?: undefined | null,
  options?: {
    /** If true, removes invalid values (null, undefined) from the result. Default is true.
     * @default true
     */
    removeInvalidValue: boolean;
  }
): undefined;
export function toStringArrayUnRecursive(
  array?: Array<never>,
  options?: {
    /** If true, removes invalid values (null, undefined) from the result. Default is true.
     * @default true
     */
    removeInvalidValue: boolean;
  }
): Array<never>;
export function toStringArrayUnRecursive(
  array?: Array<undefined | null> | Array<null | undefined>,
  options?: {
    /** If true, removes invalid values (null, undefined) from the result. Default is true.
     * @default true
     */
    removeInvalidValue: boolean;
  }
): Array<undefined>;
export function toStringArrayUnRecursive<T>(
  array?: Array<T>,
  options?: {
    /** If true, removes invalid values (null, undefined) from the result. Default is true.
     * @default true
     */
    removeInvalidValue: true;
  }
): Array<string> | undefined;
export function toStringArrayUnRecursive<T>(
  array?: Array<T>,
  options?: {
    /** If true, removes invalid values (null, undefined) from the result. Default is true.
     * @default true
     */
    removeInvalidValue: false;
  }
): Array<string | null | undefined> | undefined;
export function toStringArrayUnRecursive<T extends string | number>(
  array?: Array<T> | null,
  options: {
    /** If true, removes invalid values (null, undefined) from the result. Default is true.
     * @default true
     */
    removeInvalidValue?: boolean;
  } = {
    removeInvalidValue: true,
  }
): Array<string | null | undefined> | undefined {
  if (!isObject(options)) {
    throw new TypeError(`props 'options' must be \`object\` type!`);
  }

  const riv =
    options && "removeInvalidValue" in options
      ? options.removeInvalidValue
      : true;

  if (!isBoolean(riv)) {
    throw new TypeError(`props 'removeInvalidValue' must be \`boolean\` type!`);
  }

  if (isArray(array)) {
    // Convert each item in the array to a string, or null/undefined if it's not a valid value.
    const result = Array.from(array, (x) => {
      if (isString(x) || isNumber(x)) {
        return String(x); // Convert number or string to string
      }

      return isNull(x) ? null : undefined; // Handle null or undefined values
    });

    // Remove invalid values (null, undefined) if specified in options
    if (riv) {
      return filterNullArray(result);
    }

    return result;
  }

  return undefined; // Return undefined if no array is provided
}

//  ** ---- array string to array number ----

/** ---------------------------------
 * * ***Converts an array of string values (or values that can be cast to string) to an array of numbers.***
 * * ***Optionally removes invalid values (non-numeric values) based on the provided options.***
 * ---------------------------------
 *
 * * 🚫 Note: This function does NOT support recursive or nested arrays.
 *   It only processes a flat array of values.
 *
 * * Use `toNumbersDeep` if you want to recursive.
 * ---------------------------------
 *
 * @param {Array<string | null | undefined>} [array] - The array of string values (or values convertible to strings) to be transformed into numbers.
 * @param {Object} [options] - Options that affect the conversion behavior.
 * @param {boolean} [options.removeInvalidValueNumber=true] - If true, removes invalid number values (e.g., NaN, undefined) from the result. Default is true.
 * @returns {Array<number | undefined>} - An array of numbers converted from the string values, or an array with invalid values removed if specified.
 */
export function toNumberArrayUnRecursive(
  array?: undefined | null,
  options?: {
    /** If true, removes invalid number values (e.g., NaN, undefined) from the result. Default is true.
     *
     * @default true
     */
    removeInvalidValueNumber?: boolean;
  }
): undefined;
export function toNumberArrayUnRecursive(
  array?: Array<never>,
  options?: {
    /** If true, removes invalid number values (e.g., NaN, undefined) from the result. Default is true.
     *
     * @default true
     */
    removeInvalidValueNumber?: boolean;
  }
): Array<never>;
export function toNumberArrayUnRecursive(
  array?: Array<undefined | null> | Array<null | undefined>,
  options?: {
    /** If true, removes invalid number values (e.g., NaN, undefined) from the result. Default is true.
     *
     * @default true
     */
    removeInvalidValueNumber?: boolean;
  }
): Array<undefined>;
export function toNumberArrayUnRecursive<T>(
  array?: Array<T>,
  options?: {
    /** If true, removes invalid number values (e.g., NaN, undefined) from the result. Default is true.
     *
     * @default true
     */
    removeInvalidValueNumber?: true;
  }
): Array<number> | undefined;
export function toNumberArrayUnRecursive<T>(
  array?: Array<T>,
  options?: {
    /** If true, removes invalid number values (e.g., NaN, undefined) from the result. Default is true.
     *
     * @default true
     */
    removeInvalidValueNumber: false;
  }
): Array<number | undefined> | undefined;
export function toNumberArrayUnRecursive<T>(
  array?: Array<T> | null,
  options: {
    /** If true, removes invalid number values (e.g., NaN, undefined) from the result. Default is true.
     *
     * @default true
     */
    removeInvalidValueNumber?: boolean;
  } = {
    removeInvalidValueNumber: true,
  }
) {
  if (!isObject(options)) {
    throw new TypeError(`props 'options' must be \`object\` type!`);
  }

  const riv =
    options && "removeInvalidValueNumber" in options
      ? options.removeInvalidValueNumber
      : true;

  if (!isBoolean(riv)) {
    throw new TypeError(
      `props 'removeInvalidValueNumber' must be \`boolean\` type!`
    );
  }

  if (isArray(array)) {
    // Convert each item in the array to a number, or undefined if it's not a valid number
    const result = Array.from(array, (x) => {
      const str = String(x).trim();
      const match = str.match(/-?\d+(\.\d+)?/);
      return match ? Number(match[0]) : undefined;
    });

    // If `removeInvalidValueNumber` is false, return the result as-is, including invalid numbers (undefined)
    if (!riv) {
      return result;
    }

    // Filter out undefined (invalid) values if `removeInvalidValueNumber` is true
    return filterNullArray(result);
  }

  return undefined; // Return undefined if no array is provided
}
