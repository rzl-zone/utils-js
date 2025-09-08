import type {
  FormatPhoneNumberProps,
  FormatPhoneNumberPropsString,
  FormatPhoneNumberPropsBoolean,
  FormatPhoneNumberPropsTransform,
  ValueFormatPhoneNumber
} from "@/types/private";

import { isNil } from "@/predicates/is/isNil";
import { isNumber } from "@/predicates/is/isNumber";
import { isString } from "@/predicates/is/isString";
import { isBoolean } from "@/predicates/is/isBoolean";
import { hasOwnProp } from "@/predicates/has/hasOwnProp";
import { getPreciseType } from "@/predicates/type/getPreciseType";
import { assertIsPlainObject } from "@/assertions/objects/assertIsPlainObject";

/** -------------------------------------------------------
 * * ***Utility: `formatPhoneNumber`.***
 * -------------------------------------------------------
 * **Formats a phone number into a customizable local or international style.**
 * - **Can also:**
 *    - Return only digits (`takeNumberOnly`).
 *    - Check validity (`checkValidOnly`) using a regex for international-style phone numbers.
 * - **Validation (`checkValidOnly: true`):**
 *    - ***Valid if:***
 *       - Only contains digits, optional leading `+`, spaces, parentheses `()`,
 *         hyphens `-`, or dots `.`.
 *       - Digits-only length < 24.
 * @example
 * ```js
 * formatPhoneNumber("081234567890")
 * // ➔ "0812 3456 7890"
 * formatPhoneNumber("(0812) 3456-7890", { takeNumberOnly: true })
 * // ➔ "081234567890"
 * formatPhoneNumber("(0812) 3456-7890", { checkValidOnly: true })
 * // ➔ true
 * formatPhoneNumber("+6281234567890", { checkValidOnly: true })
 * // ➔ true
 * formatPhoneNumber("+1 (800) 123-4567", { checkValidOnly: true })
 * // ➔ true
 * formatPhoneNumber("+44 20 7946 0958", { checkValidOnly: true })
 * // ➔ true
 * formatPhoneNumber("0812-3456-7890", { checkValidOnly: true })
 * // ➔ true
 * formatPhoneNumber("(0812) 3456 7890", { checkValidOnly: true })
 * // ➔ true
 * formatPhoneNumber("0812 3456 7890", { checkValidOnly: true })
 * // ➔ true
 * formatPhoneNumber("+62abc123", { checkValidOnly: true })
 * // ➔ false
 * formatPhoneNumber("0812-3456-hello", { checkValidOnly: true })
 * // ➔ false
 * formatPhoneNumber("+62 123456789012345678901234", { checkValidOnly: true })
 * // ➔ false
 * formatPhoneNumber("++6281234567890", { checkValidOnly: true })
 * // ➔ false
 * formatPhoneNumber("invalid@@@", { checkValidOnly: true })
 * // ➔ false
 * formatPhoneNumber("+62.812.3456.7890", { checkValidOnly: true })
 * // ➔ true
 * formatPhoneNumber("+62(812)3456-7890", { checkValidOnly: true })
 * // ➔ true
 * ```
 * ```js
 * formatPhoneNumber("081234567890", {
 *   separator: "-",
 *   plusNumberCountry: "+44",
 *   openingNumberCountry: "(",
 *   closingNumberCountry: ")",
 * })
 * // ➔ "(+44) 8123-4567-890"
 * ```
 * @throws {TypeError} If `value` is not string, number, null or undefined.
 * @throws {TypeError} If `options` is not an object or contains wrong types.
 *
 * @overload Return a boolean if options With `checkValidOnly: true`.
 * @param {ValueFormatPhoneNumber} [value] The phone number input (string or number).
 * @param {FormatPhoneNumberPropsBoolean} [options] With `checkValidOnly: true`.
 * @returns {boolean} A boolean indicating whether the input is a valid phone number.
 *
 * @overload Return a string of digits only, if options With `takeNumberOnly: true`.
 * @param {ValueFormatPhoneNumber} [value] The phone number input (string or number).
 * @param {FormatPhoneNumberPropsTransform} [options] With `takeNumberOnly: true`.
 * @returns {string} A string of digits only.
 *
 * @overload Return a formatted phone number string, if options Options to customize format output (country code, separator, etc).
 * @param {ValueFormatPhoneNumber} [value] The phone number input (string or number).
 * @param {FormatPhoneNumberPropsString} [options] Options to customize format output (country code, separator, etc).
 * @returns {string} A formatted phone number string.
 */
export function formatPhoneNumber(
  value?: ValueFormatPhoneNumber,
  options?: FormatPhoneNumberPropsString
): string;

export function formatPhoneNumber(
  value?: ValueFormatPhoneNumber,
  options?: FormatPhoneNumberPropsBoolean
): boolean;

export function formatPhoneNumber(
  value?: ValueFormatPhoneNumber,
  options?: FormatPhoneNumberPropsTransform
): string;

export function formatPhoneNumber(
  value?: ValueFormatPhoneNumber,
  options: FormatPhoneNumberProps = {}
) {
  if (isNil(value)) {
    return "";
  }

  if (!isString(value) && !isNumber(value)) {
    throw new TypeError(
      `First parameter (\`value\`) must be of type \`string\`, \`number\`, \`null\` or \`undefined\`, but received: \`${getPreciseType(
        value
      )}\`.`
    );
  }

  assertIsPlainObject(options, {
    message: ({ currentType, validType }) =>
      `Second parameter (\`options\`) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });

  const separator = hasOwnProp(options, "separator") ? options.separator : " ";
  const takeNumberOnly = hasOwnProp(options, "takeNumberOnly")
    ? options.takeNumberOnly
    : false;
  const checkValidOnly = hasOwnProp(options, "checkValidOnly")
    ? options.checkValidOnly
    : false;
  const plusNumberCountry = hasOwnProp(options, "plusNumberCountry")
    ? options.plusNumberCountry
    : "";
  const openingNumberCountry = hasOwnProp(options, "openingNumberCountry")
    ? options.openingNumberCountry
    : "";
  const closingNumberCountry = hasOwnProp(options, "closingNumberCountry")
    ? options.closingNumberCountry
    : "";

  if (!isBoolean(takeNumberOnly) || !isBoolean(checkValidOnly)) {
    throw new TypeError(
      `Parameter \`takeNumberOnly\` and \`checkValidOnly\` property of the \`options\` (second parameter) must be of type \`boolean\` or unset as \`undefined\` value, but received: ['takeNumberOnly': \`${getPreciseType(
        takeNumberOnly
      )}\`, 'checkValidOnly': \`${getPreciseType(checkValidOnly)}\`].`
    );
  }

  if (
    !isString(separator) ||
    !isString(plusNumberCountry) ||
    !isString(openingNumberCountry) ||
    !isString(closingNumberCountry)
  ) {
    throw new TypeError(
      `Parameter \`separator\`, \`plusNumberCountry\`, \`openingNumberCountry\` and \`closingNumberCountry\` property of the \`options\` (second parameter) must be of type \`string\` or unset as \`undefined\` value, but received: ['separator': \`${getPreciseType(
        separator
      )}\`, 'plusNumberCountry': \`${getPreciseType(
        plusNumberCountry
      )}\`, 'openingNumberCountry': \`${getPreciseType(
        openingNumberCountry
      )}\`, 'closingNumberCountry': \`${getPreciseType(closingNumberCountry)}\`].`
    );
  }

  if (!isString(value)) {
    value = String(value);
  }

  if (takeNumberOnly) {
    return value.replace(/\D/g, "");
  }

  if (checkValidOnly) {
    return /^(\+)?[0-9\s().-]+$/.test(value) && value.replace(/\D/g, "").length < 24;
  }

  value = value.replace(/\D/g, "");

  // sanitize plusNumberCountry
  let normalizedPlus = plusNumberCountry
    .trim()
    .replace(/\s+/g, "")
    .replace(/[^\d+]/g, "");

  // If starts with ++ or +++ will return + (eg: "++62" -> "+62")
  if (/^\+/.test(normalizedPlus)) {
    // already started +, and make sure only one "+"
    normalizedPlus = "+" + normalizedPlus.replace(/^\++/, "");
  }

  // smart slicing
  let firstGroup = "";
  let rest = "";

  // country code for special leading zero rule
  const countryCodeDetails: Record<string, string> = {
    "7": "Russia, Kazakhstan",
    "27": "South Africa",
    "31": "Netherlands",
    "32": "Belgium",
    "33": "France",
    "34": "Spain",
    "36": "Hungary",
    "39": "Italy, San Marino, Vatican",
    "44": "United Kingdom",
    "46": "Sweden",
    "47": "Norway",
    "48": "Poland",
    "49": "Germany",
    "52": "Mexico",
    "54": "Argentina",
    "55": "Brazil",
    "56": "Chile",
    "61": "Australia",
    "62": "Indonesia",
    "64": "New Zealand",
    "81": "Japan",
    "82": "South Korea",
    "86": "China",
    "90": "Turkey",
    "91": "India",
    "92": "Pakistan",
    "351": "Portugal",
    "352": "Luxembourg",
    "971": "UAE"
  };

  const countryCodeForCheck = normalizedPlus
    .replace(/^\+/, "") // remove first "+"
    .replace(/[^\d]/g, ""); // remove all non digit
  if (countryCodeDetails[countryCodeForCheck] && value.startsWith("0")) {
    firstGroup = value.slice(1, 4);
    rest = value.slice(4);
  } else {
    firstGroup = value.slice(0, 4);
    rest = value.slice(4);
  }

  const plus = normalizedPlus.trim();
  const opening = openingNumberCountry.trim();
  const closing = closingNumberCountry.trim();

  let formatted = "";

  if (plus) {
    if (opening && closing) {
      formatted = `${opening}${plus}${closing} ${firstGroup}`;
    } else if (opening && !closing) {
      formatted = `${opening}${plus} ${firstGroup}`;
    } else if (!opening && closing) {
      formatted = `${plus}${closing} ${firstGroup}`;
    } else {
      formatted = `${plus} ${firstGroup}`;
    }
  } else {
    formatted = `${firstGroup}`;
  }

  const relativeChar: Record<number, string> = {
    0: separator,
    4: separator,
    8: separator,
    12: separator,
    16: separator,
    20: separator,
    24: separator
  };

  for (let i = 0; i < rest.length; i++) {
    const absoluteIndex = i + firstGroup.length;
    formatted += (relativeChar[absoluteIndex] || "") + rest[i];
  }

  return formatted;
}
