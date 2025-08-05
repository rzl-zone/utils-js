import {
  isBoolean,
  isFunction,
  isNumber,
  isObject,
  isString,
  isUndefined,
  parseCurrencyString,
} from "@/index";
import type { FormatCurrencyOptions } from "@/formatting/currency.types";

/** -------------------------------------------------------
 * * Formats a number or messy currency string into a
 *   beautifully formatted currency string, with highly
 *   customizable separators, decimal control, rounding,
 *   currency symbols, and negative styling.
 * -------------------------------------------------------
 *
 * ✅ Highlights:
 * - Accepts:
 *   * Pure numbers: `15300.95`
 *   * Messy currency strings from **any locale**:
 *     - `"Rp 15.000,21"` (Indonesian / Euro)
 *     - `"$12,345.60"` (US)
 *     - `"CHF 12'345.60"` (Swiss)
 *     - `"1,23,456.78"` (Indian)
 * - Auto extracts numeric value with smart multi-locale parsing
 *   via `parseCurrencyString`.
 * - Handles:
 *   * Thousands separators: `.`, `,`, `'`, ` `
 *   * Decimal separators: `,`, `.`
 *   * Decimal suffix (eg. `".-"`, `" USD"`)
 *   * Currency prefix (eg. `"Rp "`, `"$ "`)
 *   * Rounding: `"round"`, `"ceil"`, `"floor"`, or truncate
 *   * Negative styling: dash `-`, brackets `( )`, absolute, or custom
 * - Strong type checks & clear errors for misconfigured options.
 *
 * ✅ How input is parsed:
 * - Removes all non-digit except `.`, `,`, `'` and spaces.
 * - Detects bracket negatives: `"(15.000,10)"` ➔ `-15000.10`
 * - Uses last `,` or `.` as decimal separator (others are thousands).
 * - Ignores currency symbols like `Rp`, `$` (must re-apply with `suffixCurrency`).
 *
 * ✅ Options:
 * @param {string|number} value
 *   The input value to format.
 *   Examples:
 *     * `"Rp 15.000,21"`
 *     * `"$12,345.60"`
 *     * `"CHF 12'345.60"`
 *     * `15300.95`
 *
 * @param {FormatCurrencyOptions} [options]
 *   Optional configuration object:
 *
 *   @property {string} separator
 *     Thousands separator (default `"."`).
 *     Example: `"."` ➔ `1.000.000`
 *
 *   @property {string} separatorDecimals
 *     Decimal separator (default `","`).
 *     Example: `","` ➔ `1.000,10`
 *
 *   @property {string} suffixCurrency
 *     Prefix currency string (default `""`).
 *     Does **not auto-keep input symbols**.
 *     Must set manually: `suffixCurrency: "Rp "`.
 *
 *   @property {boolean} decimal
 *     Show decimals? (default `false`).
 *     If `false`, rounds to integer.
 *
 *   @property {number} totalDecimal
 *     Total decimal digits (default `2`).
 *     If `decimal: true` & `roundedDecimal: false`, simply cuts.
 *
 *   @property {string} suffixDecimal
 *     Text appended after decimals
 *     (e.g. `".-"`, `" USD"`). Default `""`.
 *
 *   @property {boolean} endDecimal
 *     Actually append `suffixDecimal`? (default `true`).
 *
 *   @property {"round"|"ceil"|"floor"|false} roundedDecimal
 *     Rounding mode:
 *       - `"round"` ➔ nearest
 *       - `"ceil"` ➔ always up
 *       - `"floor"` ➔ always down
 *       - `false` ➔ truncate
 *     Default `"round"`.
 *
 *   @property {"dash"|"brackets"|"abs"|{style?, space?, custom?}} negativeFormat
 *     How to format negatives:
 *       - `"dash"` ➔ `-15.000`
 *       - `"brackets"` ➔ `(15.000)`
 *       - `"abs"` ➔ `15.000` (always positive)
 *       - or object:
 *         {
 *            style: "dash"|"brackets"|"abs",
 *            space: true|false,
 *            custom: (formatted) => string
 *         }
 *     Default `"dash"`.
 *
 *   @property {boolean} indianFormat
 *     If `true`, formats as Indian: `12,34,567`.
 *     Also forces `separator: ","`, `separatorDecimals: "."`.
 *
 * @returns {string}
 *   Nicely formatted currency string.
 *   Examples:
 *     - `"15.000,10"`
 *     - `"Rp 15.000,10.-"`
 *     - `"15'000.10 USD"`
 *     - `"12,34,567.89"`
 *
 * @throws {TypeError}
 *   If:
 *     - `value` is not string or number
 *     - cannot parse to valid number
 *     - options have invalid types
 *
 * ---
 *
 * ***✅ Notes:***
 * - Always re-apply symbols via `suffixCurrency`.
 * - `parseCurrencyString` smartly detects last decimal,
 *   so `"1.121.234,56"` and `"1,121,234.56"` both parsed correctly.
 */
export const formatCurrency = (
  value: string | number,
  options: FormatCurrencyOptions = {}
): string => {
  if (!isString(value) && !isNumber(value)) {
    throw new TypeError(`props 'value' must be \`string\` or \`number\` type!`);
  }

  if (!isObject(options)) {
    throw new TypeError(`props 'options' must be \`object\` type!`);
  }

  const {
    decimal = false,
    totalDecimal = 2,
    endDecimal = true,
    indianFormat = false,
    suffixCurrency = "",
    suffixDecimal = "",
    roundedDecimal = "round",
    negativeFormat = "dash",
  } = options;

  let { separatorDecimals = ",", separator = "." } = options;

  // validations
  if (
    !isString(separator) ||
    !isString(separatorDecimals) ||
    !isString(suffixCurrency) ||
    !isString(suffixDecimal)
  ) {
    throw new TypeError(
      `props 'separator', 'separatorDecimals', 'suffixCurrency' and 'suffixDecimal' must be \`string\` type!`
    );
  }

  if (
    !isBoolean(decimal) ||
    !isBoolean(endDecimal) ||
    !isBoolean(indianFormat)
  ) {
    throw new TypeError(
      `props 'decimal', 'endDecimal' and 'indianFormat' must be \`boolean\` type!`
    );
  }

  if (!isNumber(totalDecimal)) {
    throw new TypeError(`props 'totalDecimal' must be \`number\` type!`);
  }

  if (
    !(
      roundedDecimal === false ||
      roundedDecimal === "round" ||
      roundedDecimal === "ceil" ||
      roundedDecimal === "floor"
    )
  ) {
    throw new TypeError(
      `props 'roundedDecimal' must be \`false\` or one of: 'round' | 'ceil' | 'floor'`
    );
  }

  if (
    !(
      negativeFormat === "abs" ||
      negativeFormat === "brackets" ||
      negativeFormat === "dash" ||
      isObject(negativeFormat)
    )
  ) {
    throw new TypeError(
      `props 'negativeFormat' must be on one of: 'abs' | 'brackets' | 'dash' or \`object\``
    );
  }

  // parse number
  const rawNum = isString(value) ? parseCurrencyString(value) : value;
  if (isNaN(rawNum)) {
    throw new TypeError(`'value' could not be parsed into a valid number`);
  }

  let num = Math.abs(rawNum);
  const factor = Math.pow(10, totalDecimal);

  if (roundedDecimal) {
    const scaled = num * factor;
    switch (roundedDecimal) {
      case "round":
        num = Math.round(scaled) / factor;
        break;
      case "ceil":
        num = Math.ceil(scaled) / factor;
        break;
      case "floor":
        num = Math.floor(scaled) / factor;
        break;
    }
  }

  let integerPart = "";
  let decimalPartRaw = "";

  if (roundedDecimal) {
    const scaled = num * factor;
    switch (roundedDecimal) {
      case "round":
        num = Math.round(scaled) / factor;
        break;
      case "ceil":
        num = Math.ceil(scaled) / factor;
        break;
      case "floor":
        num = Math.floor(scaled) / factor;
        break;
    }
  }

  if (roundedDecimal) {
    [integerPart, decimalPartRaw] = num.toFixed(totalDecimal).split(".");
    decimalPartRaw = decimalPartRaw ?? "".padEnd(totalDecimal, "0");
  } else {
    // cut decimal manually
    const split = String(num).split(".");
    integerPart = split[0];
    decimalPartRaw = (split[1] || "")
      .slice(0, totalDecimal)
      .padEnd(totalDecimal, "0");
  }

  let formattedInteger: string;

  const formatIndianNumber = (numStr: string, separator: string) => {
    const lastThree = numStr.slice(-3);
    const rest = numStr.slice(0, -3);
    if (!rest) return lastThree;
    return (
      rest.replace(/\B(?=(\d{2})+(?!\d))/g, separator) + separator + lastThree
    );
  };
  if (indianFormat) {
    separator = ",";
    separatorDecimals = ".";
    formattedInteger =
      (suffixCurrency.trim().length ? suffixCurrency : "") +
      formatIndianNumber(integerPart, separator);
  } else {
    formattedInteger =
      (suffixCurrency.trim().length ? suffixCurrency : "") +
      integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  }

  if (decimal && !isUndefined(decimalPartRaw) && totalDecimal > 0) {
    let formattedDecimal = separatorDecimals + decimalPartRaw;
    if (endDecimal) formattedDecimal += suffixDecimal;
    formattedInteger += formattedDecimal;
  }

  // negative format
  if (rawNum < 0) {
    if (negativeFormat === "dash") {
      formattedInteger = "-" + formattedInteger;
    } else if (negativeFormat === "brackets") {
      formattedInteger = "(" + formattedInteger + ")";
    } else if (negativeFormat === "abs") {
      // no sign
    } else if (isObject(negativeFormat)) {
      if ("custom" in negativeFormat) {
        const formatCustomNegative = negativeFormat.custom;

        if (!isFunction(formatCustomNegative)) {
          throw new TypeError(
            `props 'negativeFormat.custom' must be a function: '(formatted: string) => string'`
          );
        }

        const result = formatCustomNegative(formattedInteger);

        if (!isString(result)) {
          throw new TypeError(
            `props 'negativeFormat.custom' must return a string`
          );
        }

        formattedInteger = result;
      } else {
        const formatStyleNegative = negativeFormat.style || "dash";
        const formatSpaceNegative = isBoolean(negativeFormat.space)
          ? negativeFormat.space
          : false;

        if (!isBoolean(formatSpaceNegative)) {
          throw new TypeError(`props 'negativeFormat.space' must be boolean`);
        }
        if (
          !(
            formatStyleNegative === "abs" ||
            formatStyleNegative === "brackets" ||
            formatStyleNegative === "dash"
          )
        ) {
          throw new TypeError(
            `props 'negativeFormat.style' must be one of: 'dash' | 'brackets' | 'abs'`
          );
        }

        switch (formatStyleNegative) {
          case "dash":
            formattedInteger =
              "-" + (formatSpaceNegative ? " " : "") + formattedInteger;
            break;
          case "brackets":
            formattedInteger = formatSpaceNegative
              ? `( ${formattedInteger} )`
              : `(${formattedInteger})`;
            break;
          case "abs":
            // no sign
            break;
        }
      }
    }
  }

  return formattedInteger;
};
