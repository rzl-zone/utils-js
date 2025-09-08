import { isNumber } from "@/predicates/is/isNumber";
import { isString } from "@/predicates/is/isString";
import { getPreciseType } from "@/predicates/type/getPreciseType";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";

/** ----------------------------------------------------------
 *  * ***Utility: `replaceAt`.***
 * ----------------------------------------------------------
 * **Replaces exactly one character at the specified index in the original string
 * with the provided `replaceTo` string.**
 * - **Behavior:**
 *    - If `replaceTo` has more than one character,
 * the result will expand accordingly.
 * @param {number} index - The starting index where the replacement should occur.
 * @param {string} originalString - The original string to modify.
 * @param {string} replaceTo - The string to insert at the specified index.
 * @returns {string} The modified string with the replacement applied.
 * @example
 * replaceAt(3, "hello", "X");
 * // ➔ "helXo"
 * replaceAt(1, "world", "AB");
 * // ➔ "wABrld"
 * replaceAt(0, "cat", "br");
 * // ➔ "brat"
 * replaceAt(2, "12345", "-");
 * // ➔ "12-45"
 * replaceAt(4, "ABCDE", "Z");
 * // ➔ "ABCDZ"
 * // ❌ Examples that throw:
 * replaceAt(10, "short", "X");
 * // ➔ ❌ RangeError: First parameter (`index`) is out of range from second parameter `originalString`.
 * replaceAt(-1, "test", "X");
 * // ➔ ❌ RangeError: First parameter (`index`) is out of range from second parameter `originalString`.
 * replaceAt("1", "test", "X");
 * // ➔ ❌ TypeError: First parameter `index` must be of type `number`, second parameter `originalString` and third parameter `replaceTo` must be of type `string`, but received: "['index': `string`,...]."
 * replaceAt(2, null, "X");
 * // ➔ ❌ TypeError: First parameter `index` must be of type `number`, second parameter `originalString` and third parameter `replaceTo` must be of type `string`, but received: "['index': `string`,...]."
 */
export const replaceAt = (
  index: number,
  originalString: string,
  replaceTo: string
): string => {
  if (!isNumber(index) || !isString(replaceTo) || !isString(originalString)) {
    throw new TypeError(
      `First parameter (\`index\`) must be of type \`number\`, second parameter (\`originalString\`) and third parameter (\`replaceTo\`) must be of type \`string\`, but received: "['index': \`${getPreciseType(
        index
      )}\`, 'originalString': \`${getPreciseType(
        originalString
      )}\`, 'replaceTo': \`${getPreciseType(replaceTo)}\`]".`
    );
  }

  // Handle edge cases
  if (index < 0 || index >= originalString.length) {
    throw new RangeError(
      `First parameter (\`index\`) is out of range from second parameter (\`originalString\`).`
    );
  }

  return (
    originalString.slice(0, index) + // Extract before the index
    replaceTo + // Insert replacement
    originalString.slice(index + 1) // Extract after replacement
  );
};

/** ----------------------------------------------------------
 * * ***Utility: `getInitialsName`.***
 * ----------------------------------------------------------
 * **Extracts initials from the given name string.**
 * - **Behavior:**
 *    - For names with two or more words, returns the first letter of the first and second words.
 *    - For a single word with 2+ characters, returns the first two letters.
 *    - For a single character, returns that character.
 *    - For `empty`, `null`, `undefined` or `whitespace-only input`, returns an empty string (`""`).
 * @param {string | null | undefined} name - The name to extract initials from.
 * @returns {string} The extracted initials (e.g., "JD" for "John Doe").
 * @example
 * getInitialsName("Alice");             // ➔ "AL"
 * getInitialsName("John Doe");          // ➔ "JD"
 * getInitialsName(" Bob Marley ");      // ➔ "BM"
 * getInitialsName("John Ronald Donal"); // ➔ "JR"
 * getInitialsName("Lord John Doe Moe"); // ➔ "LJ"
 * getInitialsName("X");                 // ➔ "X"
 * getInitialsName("");                  // ➔ "" (empty string)
 * getInitialsName("  ");                // ➔ "" (empty string)
 * getInitialsName(null);                // ➔ "" (null input)
 * getInitialsName(undefined);           // ➔ "" (undefined input)
 */
export const getInitialsName = (name: string | null | undefined): string => {
  if (!isNonEmptyString(name)) return ""; // Handle empty string case

  // Trim spaces and remove duplicate spaces
  name = name.replace(/\s+/g, " ").trim();

  const nameParts = name.split(" ");

  if (nameParts.length > 1) {
    // First letter of first and second words
    return nameParts[0][0] + nameParts[1][0].toUpperCase();
  }

  return name.length > 1
    ? name.substring(0, 2).toUpperCase()
    : // First two letters for single-word names
      name[0].toUpperCase();
};
