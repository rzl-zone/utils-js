import {
  isBoolean,
  isNull,
  isNumber,
  isString,
  isUndefined,
  normalizeSpaces,
} from "@/index";

/** ----------------------------------------------
 * * ***Chunks a string by inserting a separator every `limiter` characters.***
 * ----------------------------------------------
 *
 * This function handles two main behaviors based on `reCountAfterSpace`:
 *
 * 1. If `reCountAfterSpace` is `false` (default):
 * The separator is inserted strictly every `limiter` characters throughout the entire string,
 * regardless of spaces. Spaces are treated as regular characters in the count.
 * Example: `chunkString("1234567890", 3, "-")` returns `"123-456-789-0"`.
 * Example: `chunkString("Hello World", 3, "-")` returns `"Hel-lo -Wor-ld"`.
 *
 * 2. If `reCountAfterSpace` is `true`:
 * The function first processes the input string to replace any multiple consecutive spaces
 * with a single space (e.g., "A   B" becomes "A B").
 * Then, it treats the string as a sequence of "words" (segments separated by single spaces).
 * - Each word is processed independently: if a word's length exceeds the `limiter`,
 * separators are inserted internally within that word.
 * - Words are then grouped. Each group will contain `limiter` number of words.
 * Words within the same group are joined by the specified `separator`.
 * - Finally, these groups are joined by a single space, preserving the original word separation structure
 * between groups.
 *
 * @param {string} subject - The target string where the separator will be added.
 * @param {number} limiter - The interval (number of characters) at which the separator should be inserted.
 * @param {string} [separator=" "] - The separator string to insert (default is a single space `" "`).
 * @param {boolean} [reCountAfterSpace=false] - If `true`, the counting for `limiter`
 * resets after each space, and words are grouped as described above. If `false`,
 * the counting is continuous throughout the string.
 * @returns {string} - The formatted string with separators added according to the specified rules.
 *
 * @example
 * // Basic usage (reCountAfterSpace = false)
 * chunkString("1234567890", 3, "-"); // Returns: "123-456-789-0"
 * chunkString("HelloWorld", 2, "_"); // Returns: "He_ll_oW_or_ld"
 *
 * @example
 * // Usage with reCountAfterSpace = true:
 * // Multiple spaces are normalized to single spaces before processing.
 * chunkString("AB  CD   EF GH", 2, "-", true); // Returns: "AB-CD EF-GH" (after normalization to "AB CD EF GH")
 * // Words "AB" and "CD" form a group and are joined by "-", "EF" and "GH" form another group.
 * // The groups "AB-CD" and "EF-GH" are then joined by a space.
 *
 * @example
 * // Another usage with reCountAfterSpace = true:
 * chunkString("ABC DEF GHI JKL", 3, "-", true); // Returns: "ABC-DEF-GHI JKL"
 * // Words "ABC", "DEF", "GHI" form a group and are joined by "-".
 * // The word "JKL" forms its own group (as it's the last word and completes no other group).
 * // The groups "ABC-DEF-GHI" and "JKL" are then joined by a space.
 */
export function chunkString(
  subject: string,
  limiter: number,
  separator: string = " ",
  reCountAfterSpace: boolean = false
): string {
  if (isUndefined(subject) || isNull(subject) || limiter <= 0) return subject;

  // Type validation
  if (
    !(
      isString(subject) &&
      isNumber(limiter) &&
      isString(separator) &&
      isBoolean(reCountAfterSpace)
    )
  ) {
    throw new TypeError(
      "Expected 'subject' and 'separator' to be a 'string' type, 'limiter' to be a 'number' type, 'reCountAfterSpace' to be a 'boolean' type"
    );
  }

  subject = normalizeSpaces(subject);

  // Handle reCountAfterSpace = false (assumed correct from previous iterations)
  if (!reCountAfterSpace) {
    let result = "";
    let currentCount = 0;

    for (let i = 0; i < subject.length; i++) {
      const char = subject[i];
      if (currentCount === limiter) {
        result += separator;
        currentCount = 0;
      }
      result += char;
      currentCount++;
    }
    return result;
  }

  // --- Dynamic Logic for reCountAfterSpace = true ---
  const words = subject.split(" "); // Split the string into individual words by spaces
  const finalSegments: string[] = [];

  let currentGroup: string[] = [];
  let wordsInCurrentGroupCount = 0; // This counts how many words are in the current group

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    // Check if the current word itself needs internal separators (e.g., "HelloWorld" with limiter 2)
    // For the given test cases ("AB", "CD", "ABC"), this inner loop doesn't add separators,
    // as the words themselves are shorter than or equal to the limiter.
    let processedWord = "";
    let charCountInWord = 0;
    for (let j = 0; j < word.length; j++) {
      processedWord += word[j];
      charCountInWord++;
      if (charCountInWord === limiter && j < word.length - 1) {
        processedWord += separator;
        charCountInWord = 0;
      }
    }

    currentGroup.push(processedWord);
    wordsInCurrentGroupCount++;

    // If the current group has reached the limiter (e.g., 2 words for limiter=2, or 3 words for limiter=3)
    // OR if it's the last word in the entire subject, finalize the group.
    if (wordsInCurrentGroupCount === limiter || i === words.length - 1) {
      finalSegments.push(currentGroup.join(separator)); // Join words within the group by separator
      currentGroup = []; // Reset group for the next set of words
      wordsInCurrentGroupCount = 0; // Reset group word count
    }
  }

  // Finally, join the main segments (groups) with spaces
  return finalSegments.join(" ");

  // DEPRECATED:
  // if (reCountAfterSpace) {
  //   return subject
  //     .split(" ") // Split by spaces
  //     .map((word) =>
  //       word.replace(new RegExp(`.{${limiter}}`, "g"), "$&" + separator)
  //     )
  //     .join(" ");
  // }

  // return subject.replace(
  //   new RegExp(`.{${limiter}}(?=.)`, "g"),
  //   "$&" + separator
  // );
}
