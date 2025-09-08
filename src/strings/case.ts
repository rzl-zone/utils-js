import type { Nilable } from "@/types";

import { isSet } from "@/predicates/is/isSet";
import { isArray } from "@/predicates/is/isArray";
import { isPlainObject } from "@/predicates/is/isPlainObject";
import { isNonEmptyArray } from "@/predicates/is/isNonEmptyArray";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";

type CapitalizeFirstOptions = {
  /** If true **(default)**, the rest of the string will be converted to lowercase after capitalizing the first letter.
   *
   *  @default true
   */
  lowerCaseNextRest?: boolean;
  /** If true, the string will trimmed, default: `false`.
   *
   * @default false
   */
  trim?: boolean;
};

/** ----------------------------------------------------------
 * * ***Utility: `capitalizeFirst`.***
 * ----------------------------------------------------------
 * **Capitalizes the first letter of a string, with optionally lowercases the rest and trims whitespace.**
 * @param {string | null | undefined} string - The string to be processed.
 * @param {CapitalizeFirstOptions} [options] - Options to control behavior.
 * @param {CapitalizeFirstOptions["lowerCaseNextRest"]} [options.lowerCaseNextRest=true] - If true, lowercases the rest (next first letter), default: `true`.
 * @param {CapitalizeFirstOptions["trim"]} [options.trim=false] - If true, trims the string before processing, default: `false`.
 * @returns {string} The processed string, returns `""` if input is `null`, `undefined`, or `not a valid string`.
 * @example
 * ```ts
 * capitalizeFirst(" hello WORLD ")
 * // ➔ " Hello world"
 * capitalizeFirst(" hello WORLD ", { trim: true })
 * // ➔ "Hello world"
 * capitalizeFirst("FOO", { lowerCaseNextRest: false })
 * // ➔ "FOO"
 * capitalizeFirst("   foo BAR   ", { trim: true, lowerCaseNextRest: false })
 * // ➔ "Foo BAR"
 * ```
 * #### ℹ️ If null, undefined, or not a valid string input, return `""`.
 * ```ts
 * capitalizeFirst(123)
 * capitalizeFirst(null)
 * capitalizeFirst(undefined)
 * // ➔ ""
 * ```
 */
export const capitalizeFirst = (
  string: string | null | undefined,
  options: CapitalizeFirstOptions = {
    lowerCaseNextRest: true,
    trim: false
  }
): string => {
  if (!isNonEmptyString(string)) return "";

  if (!isPlainObject(options)) {
    options = {};
  }

  const lowerCaseNextRest = options.lowerCaseNextRest !== false;
  const trim = options.trim === true;

  if (trim) string = string.trim();

  return (
    string[0].toUpperCase() +
    (lowerCaseNextRest ? string.slice(1).toLowerCase() : string.slice(1))
  );
};

// ------------------------------

type CapitalizeWordsOptions = {
  /** If `true`, removes leading and trailing spaces, default `false`.
   *
   * @default false
   */
  trim?: boolean;
  /** If `true`, collapses multiple spaces **between words** into a single space (while preserving leading/trailing spaces), default `false`.
   *
   * @default false
   */
  collapseSpaces?: boolean;
};

/** ----------------------------------------------------------
 * * ***Utility: `capitalizeWords`.***
 * ----------------------------------------------------------
 * **Capitalizes the first letter of each word in a string while converting the rest to lowercase.**
 * @param {string | null | undefined} value
 *  The input string to be processed.
 *   - If `null` or `undefined`, returns an empty-string (`""`).
 * @param {CapitalizeWordsOptions} [options]
 *  Optional settings to control the output:
 *   - `trim`: If `true`, removes leading and trailing spaces, defaultValue: `false`.
 *   - `collapseSpaces`: If `true`, collapses multiple spaces **between words** into a single space (while preserving leading/trailing spaces), defaultValue: `false`.
 * @returns {string} A new string where each word starts with an uppercase letter
 * and the remaining letters are lowercase.
 *  - If `value` is `empty`, `null`, or `undefined`, returns an `empty-string`.
 * @example
 * ```ts
 * capitalizeWords("  hello   world  ");
 * // ➔ "  Hello   World  "
 * capitalizeWords("  hello   world  ", { trim: true });
 * // ➔ "Hello   World"
 * capitalizeWords("  hello   world  ", { collapseSpaces: true });
 * // ➔ "  Hello World  "
 * capitalizeWords("  hello   world  ", { trim: true, collapseSpaces: true });
 * // ➔ "Hello World"
 * ```
 * #### ℹ️ If null, undefined, or not a valid string input, return "".
 * ```ts
 * capitalizeWords(123);
 * capitalizeWords(null);
 * capitalizeWords(undefined);
 * // ➔ ""
 * ```
 */
export const capitalizeWords = (
  value: string | null | undefined,
  options: CapitalizeWordsOptions = {
    collapseSpaces: false,
    trim: false
  }
): string => {
  if (!isNonEmptyString(value)) return "";

  let result = value;

  if (!isPlainObject(options)) {
    options = {};
  }

  const collapseSpaces = options.collapseSpaces === true;
  const trim = options.trim === true;

  if (trim) {
    result = result.trim();
  }

  if (collapseSpaces) {
    const leadingSpaces = result.match(/^\s*/)?.[0] ?? "";
    const trailingSpaces = result.match(/\s*$/)?.[0] ?? "";
    result = result.trim().replace(/\s+/g, " ");
    result = `${leadingSpaces}${result}${trailingSpaces}`;
  }

  return result
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/** --------------------------------------------------
 * * ***Represents a string input.***
 * --------------------------------------------------
 *
 * - **Can be one of:**
 *    - A single `string`
 *    - An array of strings (`string[]`)
 *    - A readonly array of strings (`readonly string[]`)
 *    - `null` or `undefined`
 *
 * @template T - A string or array of strings.
 */

type StringLike = Nilable<string | string[] | ReadonlyArray<string>>;

/** --------------------------------------------------
 * * ***Represents a collection of strings.***
 * --------------------------------------------------
 *
 * - **Can be one of:**
 *    - A single `string`
 *    - An array of strings (`string[]`)
 *    - A readonly array of strings (`readonly string[]`)
 *    - A `Set<string>`
 *    - A `ReadonlySet<string>`
 */
type StringCollection =
  | string
  | string[]
  | ReadonlyArray<string>
  | Set<string>
  | ReadonlySet<string>;

//! Private Helper CasesWord --------------------------------
const validateCaseInputWordsCase = (input: NonNullable<StringLike>): string[] => {
  let result: string = "";

  if (isArray(input)) {
    result = input
      .map((x) => (isNonEmptyString(x) ? x.trim() : ""))
      .filter((x) => x.length)
      .join("-");
  } else if (isNonEmptyString(input)) {
    result = input.trim();
  }

  return result.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
};
const validateCaseIgnoreWordsCase = (ignoreWord?: StringCollection): Set<string> => {
  const result = new Set<string>([]);

  const normalizeWord = (word: string) =>
    word
      .trim()
      .split(/[^\p{L}\p{N}]+/u)
      .filter(Boolean)
      .join("");

  if (isNonEmptyString(ignoreWord)) {
    const clean = normalizeWord(ignoreWord);
    if (clean) result.add(clean);
  }
  if (isNonEmptyArray(ignoreWord)) {
    ignoreWord.forEach((w) => {
      if (isNonEmptyString(w)) {
        const clean = normalizeWord(w);
        if (clean) result.add(clean);
      }
    });
  }
  if (isSet(ignoreWord)) {
    ignoreWord.forEach((w) => {
      if (isNonEmptyString(w)) {
        const clean = normalizeWord(w);
        if (clean) result.add(clean);
      }
    });
  }

  return result;
};
// ----------------------------------------------------------

/** ----------------------------------------------------------
 * * ***Utility: `toCamelCase`.***
 * ----------------------------------------------------------
 * **Converts a string (or array of strings) into `camelCase`, with optionally leaving specific words unchanged.**
 * - **Behavior:**
 *    - Accepts a `string` or an `array of strings`:
 *      - If an array is provided, elements are trimmed, empty ones removed,
 *        then joined with `"-"` before conversion.
 *    - Splits the input by non-alphanumeric characters
 *      (spaces, punctuation, symbols, hyphens, underscores, emojis, etc.).
 *    - The first word is fully lowercase; subsequent words are capitalized.
 *    - Words listed in `ignoreWord` remain unchanged in the output.
 *    - `ignoreWord` is normalized (trimmed, delimiters removed), empty values ignored.
 *    - `ignoreWord` accepts:
 *      - a single string,
 *      - an array of strings, or
 *      - a `Set` of strings.
 *    - Multiple delimiters collapse into one; empty segments ignored.
 *    - Returns `""` if the input is `null`, `undefined`, or empty.
 * @param {StringLike} input - The string or array to convert. Returns `""` if empty, `null`, or `undefined`.
 * @param {StringCollection} [ignoreWord] - Optional word(s) to leave unchanged in the output.
 * @returns {string} The camelCase formatted string.
 * @example
 * // Basic usage
 * toCamelCase("hello world");
 * // ➔ "helloWorld"
 *
 * // Array input is joined before conversion
 * toCamelCase(["Join", "Words", "Here"]);
 * // ➔ "joinWordsHere"
 *
 * // Supports mixed delimiters
 * toCamelCase("convert_to-camel case");
 * // ➔ "convertToCamelCase"
 *
 * // Words in ignoreWord stay unchanged
 * toCamelCase("this URL path will ignore", "URL");
 * // ➔ "thisURLPathWillIgnore"
 *
 * // Multiple ignored words
 * toCamelCase("ignore API and URL", ["API", "URL"]);
 * // ➔ "ignoreAPIAndURL"
 *
 * // Set can also be used
 * toCamelCase("ignore API and URL", new Set(["API", "URL"]));
 * // ➔ "ignoreAPIAndURL"
 *
 * // Null, Undefined or empty (string or array) input returns empty string
 * toCamelCase(null);
 * // ➔ ""
 */
export const toCamelCase = (input: StringLike, ignoreWord?: StringCollection): string => {
  if (!isNonEmptyArray(input) && !isNonEmptyString(input)) return "";

  const wordsValidated = validateCaseInputWordsCase(input);
  const ignoreWordsValidated = validateCaseIgnoreWordsCase(ignoreWord);

  return wordsValidated
    .map((word, index) => {
      if (ignoreWordsValidated.has(word)) return word;
      return index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
};

/** ----------------------------------------------------------
 * * ***Utility: `toPascalCaseSpace`.***
 * ----------------------------------------------------------
 * **Converts a string (or array of strings) into `PascalCaseSpace`, with optionally leaving specific words unchanged.**
 * - **Behavior:**
 *    - Accepts a `string` or an `array of strings`:
 *      - If an array is provided, elements are trimmed, empty ones removed,
 *        then joined with `"-"` before conversion.
 *    - Splits the input by non-alphanumeric characters
 *      (spaces, punctuation, symbols, hyphens, underscores, emojis, etc.).
 *    - The first word is fully lowercase; subsequent words are capitalized.
 *    - Words listed in `ignoreWord` remain unchanged in the output.
 *    - `ignoreWord` is normalized (trimmed, delimiters removed), empty values ignored.
 *    - `ignoreWord` accepts:
 *      - a single string,
 *      - an array of strings, or
 *      - a `Set` of strings.
 *    - Multiple delimiters collapse into one; empty segments ignored.
 *    - Returns `""` if the input is `null`, `undefined`, or empty.
 * @param {StringLike} input - The string or array to convert. Returns `""` if empty, `null`, or `undefined`.
 * @param {StringCollection} [ignoreWord] - Optional word(s) to leave unchanged in the output.
 * @returns {string} The PascalCaseSpace formatted string.
 * @example
 * // Basic usage
 * toPascalCaseSpace("hello world");
 * // ➔ "Hello World"
 *
 * // Array input is joined before conversion
 * toPascalCaseSpace(["Join", "Words", "Here"]);
 * // ➔ "Join Words Here"
 *
 * // Handles underscores and hyphens
 * toPascalCaseSpace("convert_to-pascal case");
 * // ➔ "Convert To Pascal Case Space"
 *
 * // Trims extra delimiters
 * toPascalCaseSpace("___hello--world__ again!!");
 * // ➔ "Hello World Again"
 *
 * // Supports emojis and symbols
 * toPascalCaseSpace("🔥fire_and-ice❄️");
 * // ➔ "Fire And Ice"
 *
 * // Ignore single word
 * toPascalCaseSpace("this URL path will ignore", "URL");
 * // ➔ "This URL Path Will Ignore"
 *
 * // Ignore multiple words
 * toPascalCaseSpace("ignore API and URL", ["API", "URL"]);
 * // ➔ "Ignore API And URL"
 *
 * // Ignore using Set
 * toPascalCaseSpace("ignore API and URL", new Set(["API", "URL"]));
 * // ➔ "Ignore API And URL"
 *
 * // Null, Undefined or empty (string or array) input returns empty string
 * toPascalCaseSpace(undefined);
 * // ➔ ""
 */
export const toPascalCaseSpace = (
  input: StringLike,
  ignoreWord?: StringCollection
): string => {
  if (!isNonEmptyArray(input) && !isNonEmptyString(input)) return "";

  const wordsValidated = validateCaseInputWordsCase(input);
  const ignoreWordsValidated = validateCaseIgnoreWordsCase(ignoreWord);

  return wordsValidated
    .map((word) => {
      if (ignoreWordsValidated.has(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
};

/** ----------------------------------------------------------
 * * ***Utility: `toPascalCase`.***
 * ----------------------------------------------------------
 * **Converts a string (or array of strings) into `PascalCase`, with optionally leaving specific words unchanged.**
 * - **Behavior:**
 *    - Accepts a `string` or an `array of strings`:
 *      - If an array is provided, elements are trimmed, empty ones removed,
 *        then joined with `"-"` before conversion.
 *    - Splits the input by non-alphanumeric characters
 *      (spaces, punctuation, symbols, hyphens, underscores, emojis, etc.).
 *    - The first word is fully lowercase; subsequent words are capitalized.
 *    - Words listed in `ignoreWord` remain unchanged in the output.
 *    - `ignoreWord` is normalized (trimmed, delimiters removed), empty values ignored.
 *    - `ignoreWord` accepts:
 *      - a single string,
 *      - an array of strings, or
 *      - a `Set` of strings.
 *    - Multiple delimiters collapse into one; empty segments ignored.
 *    - Returns `""` if the input is `null`, `undefined`, or empty.
 * @param {StringLike} input - The string or array to convert. Returns `""` if empty, `null`, or `undefined`.
 * @param {StringCollection} [ignoreWord] - Optional word(s) to leave unchanged in the output.
 * @returns {string} The PascalCase formatted string.
 * @example
 * // Basic usage
 * toPascalCase("hello world");
 * // ➔ "HelloWorld"
 *
 * // Array input is joined before conversion
 * toPascalCase(["Join", "Words", "Here"]);
 * // ➔ "JoinWordsHere"
 *
 * // Handles underscores and hyphens
 * toPascalCase("convert_to-pascal case");
 * // ➔ "ConvertToPascalCase"
 *
 * // Trims extra delimiters
 * toPascalCase("___hello--world__ again!!");
 * // ➔ "HelloWorldAgain"
 *
 * // Supports emojis and symbols
 * toPascalCase("🔥fire_and-ice❄️");
 * // ➔ "FireAndIce"
 *
 * // Ignore single word
 * toPascalCase("this URL path will ignore", "URL");
 * // ➔ "ThisURLPathWillIgnore"
 *
 * // Ignore multiple words
 * toPascalCase("ignore API and URL", ["API", "URL"]);
 * // ➔ "IgnoreAPIAndURL"
 *
 * // Ignore using Set
 * toPascalCase("ignore API and URL", new Set(["API", "URL"]));
 * // ➔ "IgnoreAPIAndURL"
 *
 * // Null, Undefined or empty (string or array) input returns empty string
 * toPascalCase(undefined);
 * // ➔ ""
 */
export const toPascalCase = (
  input: StringLike,
  ignoreWord?: StringCollection
): string => {
  if (!isNonEmptyArray(input) && !isNonEmptyString(input)) return "";

  const wordsValidated = validateCaseInputWordsCase(input);
  const ignoreWordsValidated = validateCaseIgnoreWordsCase(ignoreWord);

  return wordsValidated
    .map((word) => {
      if (ignoreWordsValidated.has(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
};

/** ----------------------------------------------------------
 * * ***Utility: `toLowerCase`.***
 * ----------------------------------------------------------
 * **Converts a string (or array of strings) into `lower case`, with optionally leaving specific words unchanged.**
 * - **Behavior:**
 *    - Accepts a `string` or an `array of strings`:
 *      - If an array is provided, elements are trimmed, empty ones removed,
 *        then joined with `"-"` before conversion.
 *    - Splits the input by non-alphanumeric characters
 *      (spaces, punctuation, symbols, hyphens, underscores, emojis, etc.).
 *    - The first word is fully lowercase; subsequent words are capitalized.
 *    - Words listed in `ignoreWord` remain unchanged in the output.
 *    - `ignoreWord` is normalized (trimmed, delimiters removed), empty values ignored.
 *    - `ignoreWord` accepts:
 *      - a single string,
 *      - an array of strings, or
 *      - a `Set` of strings.
 *    - Multiple delimiters collapse into one; empty segments ignored.
 *    - Returns `""` if the input is `null`, `undefined`, or empty.
 * @param {StringLike} input - The string or array to convert. Returns `""` if empty, `null`, or `undefined`.
 * @param {StringCollection} [ignoreWord] - Optional word(s) to leave unchanged in the output.
 * @returns {string} The LowerCase formatted string.
 * @example
 * // Basic usage
 * toLowerCase("Hello World");
 * // ➔ "hello world"
 *
 * // Array input is joined before conversion
 * toLowerCase(["Join", "WORLD", "Here"]);
 * // ➔ "join words here"
 *
 * // Handles underscores and hyphens
 * toLowerCase("convert_to-pascal case");
 * // ➔ "convert to lower case"
 *
 * // Trims extra delimiters
 * toLowerCase("___hello--world__ again!!");
 * // ➔ "hello world again"
 *
 * // Supports emojis and symbols
 * toLowerCase("🔥fire_and-ice❄️");
 * // ➔ "fire and ice"
 *
 * // Ignore single word
 * toLowerCase("this URL path will ignore", "URL");
 * // ➔ "this URL path will ignore"
 *
 * // Ignore multiple words
 * toLowerCase("ignore API and URL", ["API", "URL"]);
 * // ➔ "ignore API and URL"
 *
 * // Ignore using Set
 * toLowerCase("ignore API and URL", new Set(["API", "URL"]));
 * // ➔ "ignore API and URL"
 *
 * // Null, Undefined or empty (string or array) input returns empty string
 * toLowerCase(undefined);
 * // ➔ ""
 */
export const toLowerCase = (input: StringLike, ignoreWord?: StringCollection): string => {
  if (!isNonEmptyArray(input) && !isNonEmptyString(input)) return "";

  const wordsValidated = validateCaseInputWordsCase(input);
  const ignoreWordsValidated = validateCaseIgnoreWordsCase(ignoreWord);

  return wordsValidated
    .map((word) => {
      if (ignoreWordsValidated.has(word)) return word;
      return word.toLowerCase();
    })
    .join(" ");
};

/** ----------------------------------------------------------
 * * ***Utility: `toKebabCase`.***
 * ----------------------------------------------------------
 * **Converts a string (or array of strings) into `kebab-case`, with optionally leaving specific words unchanged.**
 * - **Behavior:**
 *    - Accepts a `string` or an `array of strings`:
 *      - If an array is provided, elements are trimmed, empty ones removed,
 *        then joined with `"-"` before conversion.
 *    - Splits the input by non-alphanumeric characters
 *      (spaces, punctuation, symbols, hyphens, underscores, emojis, etc.).
 *    - The first word is fully lowercase; subsequent words are capitalized.
 *    - Words listed in `ignoreWord` remain unchanged in the output.
 *    - `ignoreWord` is normalized (trimmed, delimiters removed), empty values ignored.
 *    - `ignoreWord` accepts:
 *      - a single string,
 *      - an array of strings, or
 *      - a `Set` of strings.
 *    - Multiple delimiters collapse into one; empty segments ignored.
 *    - Returns `""` if the input is `null`, `undefined`, or empty.
 * @param {StringLike} input - The string or array to convert. Returns `""` if empty, `null`, or `undefined`.
 * @param {StringCollection} [ignoreWord] - Optional word(s) to leave unchanged in the output.
 * @returns {string} The kebab-case formatted string.
 * @example
 * // Basic usage
 * toKebabCase("Hello World");
 * // ➔ "hello-world"
 *
 * // Array input is joined before conversion
 * toKebabCase(["Join", "Words", "Here"]);
 * // ➔ "join-words-here"
 *
 * // Handles underscores and hyphens
 * toKebabCase("convert_to-kebab case");
 * // ➔ "convert-to-kebab-case"
 *
 * // Handles emojis and symbols
 * toKebabCase("🔥fire___and--ice❄️");
 * // ➔ "fire-and-ice"
 *
 * // Ignore specific word
 * toKebabCase("ignore URL case", "URL");
 * // ➔ "ignore-URL-case"
 *
 * // Ignore multiple words
 * toKebabCase("ignore API and URL", ["API", "URL"]);
 * // ➔ "ignore-API-and-URL"
 *
 * // Ignore with Set
 * toKebabCase("ignore API and URL", new Set(["API", "URL"]));
 * // ➔ "ignore-API-and-URL"
 *
 * // Null, Undefined or empty (string or array) input returns empty string
 * toKebabCase(null);
 * // ➔ ""
 */
export const toKebabCase = (input: StringLike, ignoreWord?: StringCollection): string => {
  if (!isNonEmptyArray(input) && !isNonEmptyString(input)) return "";

  const wordsValidated = validateCaseInputWordsCase(input);
  const ignoreWordsValidated = validateCaseIgnoreWordsCase(ignoreWord);

  return wordsValidated
    .map((word) => {
      if (ignoreWordsValidated.has(word)) return word;
      return word.toLowerCase();
    })
    .join("-");
};

/** ----------------------------------------------------------
 * * ***Utility: `toSnakeCase`.***
 * ----------------------------------------------------------
 * **Converts a string (or array of strings) into `snake_case`, with optionally leaving specific words unchanged.**
 * - **Behavior:**
 *    - Accepts a `string` or an `array of strings`:
 *      - If an array is provided, elements are trimmed, empty ones removed,
 *        then joined with `"-"` before conversion.
 *    - Splits the input by non-alphanumeric characters
 *      (spaces, punctuation, symbols, hyphens, underscores, emojis, etc.).
 *    - The first word is fully lowercase; subsequent words are capitalized.
 *    - Words listed in `ignoreWord` remain unchanged in the output.
 *    - `ignoreWord` is normalized (trimmed, delimiters removed), empty values ignored.
 *    - `ignoreWord` accepts:
 *      - a single string,
 *      - an array of strings, or
 *      - a `Set` of strings.
 *    - Multiple delimiters collapse into one; empty segments ignored.
 *    - Returns `""` if the input is `null`, `undefined`, or empty.
 * @param {StringLike} input - The string or array to convert. Returns `""` if empty, `null`, or `undefined`.
 * @param {StringCollection} [ignoreWord] - Optional word(s) to leave unchanged in the output.
 * @returns {string} The snake_case formatted string.
 * @example
 * // Basic usage
 * toSnakeCase("Hello World");
 * // ➔ "hello_world"
 *
 * // Array input is joined before conversion
 * toSnakeCase(["Join", "Words", "Here"]);
 * // ➔ "join_words_here"
 *
 * // Handles underscores, hyphens, spaces
 * toSnakeCase("convert-to_snake case");
 * // ➔ "convert_to_snake_case"
 *
 * // Handles emojis and symbols
 * toSnakeCase("🔥fire___and--ice❄️");
 * // ➔ "fire_and_ice"
 *
 * // Ignore specific word
 * toSnakeCase("ignore URL case", "URL");
 * // ➔ "ignore_URL_case"
 *
 * // Ignore multiple words
 * toSnakeCase("ignore API and URL", ["API", "URL"]);
 * // ➔ "ignore_API_and_URL"
 *
 * // Ignore with Set
 * toSnakeCase("ignore API and URL", new Set(["API", "URL"]));
 * // ➔ "ignore_API_and_URL"
 *
 * // Null, Undefined or empty (string or array) input returns empty string
 * toSnakeCase(null);
 * // ➔ ""
 */
export const toSnakeCase = (input: StringLike, ignoreWord?: StringCollection): string => {
  if (!isNonEmptyArray(input) && !isNonEmptyString(input)) return "";

  const wordsValidated = validateCaseInputWordsCase(input);
  const ignoreWordsValidated = validateCaseIgnoreWordsCase(ignoreWord);

  return wordsValidated
    .map((word) => {
      if (ignoreWordsValidated.has(word)) return word;
      return word.toLowerCase();
    })
    .join("_");
};

/** ----------------------------------------------------------
 * * ***Utility: `toDotCase`.***
 * ----------------------------------------------------------
 * **Converts a string (or array of strings) into `dot.case`, with optionally leaving specific words unchanged.**
 * - **Behavior:**
 *    - Accepts a `string` or an `array of strings`:
 *      - If an array is provided, elements are trimmed, empty ones removed,
 *        then joined with `"-"` before conversion.
 *    - Splits the input by non-alphanumeric characters
 *      (spaces, punctuation, symbols, hyphens, underscores, emojis, etc.).
 *    - The first word is fully lowercase; subsequent words are capitalized.
 *    - Words listed in `ignoreWord` remain unchanged in the output.
 *    - `ignoreWord` is normalized (trimmed, delimiters removed), empty values ignored.
 *    - `ignoreWord` accepts:
 *      - a single string,
 *      - an array of strings, or
 *      - a `Set` of strings.
 *    - Multiple delimiters collapse into one; empty segments ignored.
 *    - Returns `""` if the input is `null`, `undefined`, or empty.
 * @param {StringLike} input - The string or array to convert. Returns `""` if empty, `null`, or `undefined`.
 * @param {StringCollection} [ignoreWord] - Optional word(s) to leave unchanged in the output.
 * @returns {string} The dot.case formatted string.
 * @example
 * // Basic usage
 * toDotCase("Hello World");
 * // ➔ "hello.world"
 *
 * // Array input is joined before conversion
 * toDotCase(["Join", "Words", "Here"]);
 * // ➔ "join.words.here"
 *
 * // Handles underscores and hyphens
 * toDotCase("convert-to_dot case");
 * // ➔ "convert.to.dot.case"
 *
 * // Multiple delimiters and trimming
 * toDotCase("___Hello--World__ again!!");
 * // ➔ "hello.world.again"
 *
 * // Supports emojis and symbols
 * toDotCase("🔥Fire_and-ice❄️");
 * // ➔ "fire.and.ice"
 *
 * // Ignore single word
 * toDotCase("this URL path", "URL");
 * // ➔ "this.URL.path"
 *
 * // Ignore multiple words
 * toDotCase("ignore API and URL", ["API", "URL"]);
 * // ➔ "ignore.API.and.URL"
 *
 * // Ignore using Set
 * toDotCase("ignore API and URL", new Set(["API", "URL"]));
 * // ➔ "ignore.API.and.URL"
 *
 * // Null, Undefined or empty (string or array) input returns empty string
 * toDotCase(undefined);
 * // ➔ ""
 */
export const toDotCase = (input: StringLike, ignoreWord?: StringCollection): string => {
  if (!isNonEmptyArray(input) && !isNonEmptyString(input)) return "";

  const wordsValidated = validateCaseInputWordsCase(input);
  const ignoreWordsValidated = validateCaseIgnoreWordsCase(ignoreWord);

  return wordsValidated
    .map((word) => {
      if (ignoreWordsValidated.has(word)) return word;
      return word.toLowerCase();
    })
    .join(".");
};

/** ----------------------------------------------------------
 * * ***Utility: `slugify`.***
 * ----------------------------------------------------------
 * **Slugifies a string (or array of strings) for safe use in URLs, with optionally leaving specific words unchanged.**
 * - **Behavior:**
 *    - Accepts a `string` or an `array of strings`:
 *      - If an array is provided, elements are trimmed, empty ones removed,
 *        then joined with `"-"` before conversion.
 *    - Splits the input by non-alphanumeric characters
 *      (spaces, punctuation, symbols, hyphens, underscores, emojis, etc.).
 *    - The first word is fully lowercase; subsequent words are capitalized.
 *    - Words listed in `ignoreWord` remain unchanged in the output.
 *    - `ignoreWord` is normalized (trimmed, delimiters removed), empty values ignored.
 *    - `ignoreWord` accepts:
 *      - a single string,
 *      - an array of strings, or
 *      - a `Set` of strings.
 *    - Multiple delimiters collapse into one; empty segments ignored.
 *    - Returns `""` if the input is `null`, `undefined`, or empty.
 * @param {StringLike} input - The string or array to convert. Returns `""` if empty, `null`, or `undefined`.
 * @param {StringCollection} [ignoreWord] - Optional word(s) to leave unchanged in the output.
 * @returns {string} The slugified string.
 * @example
 * // Basic usage
 * slugify("Hello World!");
 * // ➔ "hello-world"
 *
 * // Array input is joined before conversion
 * slugify(["Join", "Words", "Here"]);
 * // ➔ "join-words-here"
 *
 * // Trims and cleans input
 * slugify(" --- Convert to Slug? --- ");
 * // ➔ "convert-to-slug"
 *
 * // Ignore single word
 * slugify("This URL path", "URL");
 * // ➔ "this-URL-path"
 *
 * // Ignore multiple words
 * slugify("ignore API and URL", ["API", "URL"]);
 * // ➔ "ignore-API-and-URL"
 *
 * // Ignore using Set
 * slugify("ignore API and URL", new Set(["API", "URL"]));
 * // ➔ "ignore-API-and-URL"
 *
 * // Supports emojis and symbols
 * slugify("🔥 Fire_and_ice ❄️");
 * // ➔ "fire-and-ice"
 *
 * // Null, Undefined or empty (string or array) input returns empty string
 * slugify(undefined);
 * // ➔ ""
 */
export const slugify = (input: StringLike, ignoreWord?: StringCollection): string => {
  if (!isNonEmptyArray(input) && !isNonEmptyString(input)) return "";

  const wordsValidated = validateCaseInputWordsCase(input);
  const ignoreWordsValidated = validateCaseIgnoreWordsCase(ignoreWord);

  // map + join
  const slug = wordsValidated
    .map((word) => {
      if (ignoreWordsValidated.has(word)) return word;
      return word.toLowerCase();
    })
    .join("-");

  // trim hyphens
  return slug.replace(/^-+|-+$/g, "");
};
