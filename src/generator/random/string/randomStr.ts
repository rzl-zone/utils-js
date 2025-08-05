import { isBoolean, isInteger, isObject } from "@/predicates";
import type { RandomStringOptions } from "@/types/private";
import { randomInt } from "../integer";

/** ---------------------------------------------------------------------------------
 * * ***Generates a random alphanumeric string or number with a specified length range.***
 * ---------------------------------------------------------------------------------
 *
 * @description
 * This function allows you to generate random strings or numbers with fully customizable options,
 * such as length range, character sets, inclusion of additional characters, and whether to avoid whitespace.
 *
 * @param {Object} [options] - Configuration options for generating the string.
 * @param {number} [options.minLength=40] - Minimum length of the generated string (must be ≥ 1).
 * @param {number} [options.maxLength=40] - Maximum length of the generated string (must be ≤ 5000).
 * @param {"string" | "number"} [options.type="string"] - Whether to generate a general alphanumeric string or purely numeric string.
 * @param {boolean} [options.avoidWhiteSpace=true] - If true, removes all whitespace, tabs, and newlines from the character set before generating.
 * @param {string} [options.replaceGenStr] - A custom character set to use when `type` is `"string"`.
 * @param {string} [options.replaceGenInt] - A custom character set to use when `type` is `"number"`.
 * @param {string} [options.addChar] - Additional characters to always include in the character set.
 *
 * @returns {string} The randomly generated string or numeric string of the desired length.
 *
 * @throws {Error} If provided options are invalid (such as minLength > maxLength, invalid type, or empty character set).
 *
 * @example
 * randomStr(); // → Generates a 40-character random alphanumeric string
 * randomStr({ minLength: 10, maxLength: 20 }); // → Generates a string between 10 and 20 characters
 * randomStr({ type: "number", minLength: 5, maxLength: 5 }); // → "48302"
 * randomStr({ replaceGenStr: "ABC ", avoidWhiteSpace: false }); // → String using A, B, C and space
 * randomStr({ addChar: "!@#", minLength: 15, maxLength: 15 }); // → Guaranteed to include !@# in the set
 */
export const randomStr = (options?: RandomStringOptions): string => {
  // Ensure options is an object and Defensive options check
  if (!isObject(options)) {
    options = {};
  }

  const {
    minLength = 40,
    maxLength = 40,
    type = "string",
    avoidWhiteSpace = true,
  } = options;

  // Validate `avoidWhiteSpace`
  if (!isBoolean(avoidWhiteSpace)) {
    throw new Error("Invalid parameter: `avoidWhiteSpace` must be 'boolean'.");
  }

  // Validate `minLength` & `maxLength`
  if (
    !isInteger(minLength) ||
    !isInteger(maxLength) ||
    minLength < 1 ||
    maxLength > 5000 ||
    minLength > maxLength
  ) {
    throw new Error(
      "Invalid parameters: `minLength` must be ≥ 1, `maxLength` must be ≤ 5000, and `minLength` ≤ `maxLength`."
    );
  }

  // Validate `type` value props (is not typeof)
  if (type !== "string" && type !== "number") {
    throw new Error(
      "Invalid parameter: `type` must be either 'string' or 'number'."
    );
  }

  // Generate a random length within the range
  const length = randomInt(minLength, maxLength);

  // Function to clean characters based on `avoidWhiteSpace`
  const cleanCharacters = (charSet: string) => {
    return avoidWhiteSpace ? charSet.replace(/\s|\n|\t/g, "") : charSet;
  };

  // Define character sets
  const defaultNumberSet = "0123456789";
  const defaultStringSet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  const baseCharSet =
    type === "number"
      ? options.replaceGenInt ?? defaultNumberSet
      : options.replaceGenStr ?? defaultStringSet;

  // Get the final character set
  const characterSet = cleanCharacters(baseCharSet) + (options.addChar || "");

  // Ensure characterSet is not empty
  if (!characterSet.length) {
    throw new Error(
      "Character set is empty. Ensure `replaceGenInt` or `replaceGenStr` has valid characters."
    );
  }

  // Generate random string
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characterSet.charAt(
      Math.floor(Math.random() * characterSet.length)
    );
  }

  return result;
};
