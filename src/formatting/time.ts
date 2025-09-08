import type { FormatDateFnsOptions, FormatDateIntlOptions } from "./time.private.types";

import { id, enUS } from "date-fns/locale";
import { format as formatDns, isDate, parse } from "date-fns";

import { isNil } from "@/predicates/is/isNil";
import { isNaN } from "@/predicates/is/isNaN";
import { isString } from "@/predicates/is/isString";
import { hasOwnProp } from "@/predicates/has/hasOwnProp";
import { isEmptyString } from "@/predicates/is/isEmptyString";
import { isPlainObject } from "@/predicates/is/isPlainObject";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";

/** ----------------------------------------------------------
 * * ***Utility: `formatDateTime`.***
 * ----------------------------------------------------------
 * **Formats a date and time into a custom string format.**
 *  - **Features:**
 *    - Supports only `YYYY`, `MM`, `DD`, `hh`, `mm`, and `ss` as placeholders.
 *    - Uses a simple string replace (no locale).
 *    - Returns `null` if the date is invalid or not provided.
 *    - Defaults to `"YYYY-MM-DD hh:mm:ss"` format if none is specified.
 * @param {string | Date | null| undefined} date - The date to format.
 * @param {string} [format="YYYY-MM-DD hh:mm:ss"] - The desired date format, if format is `null` or `undefined` will force to defaultValue, defaultValue: `"YYYY-MM-DD hh:mm:ss"`.
 * @returns {string | null} The formatted date string or `null` if invalid.
 * @example
 * formatDateTime(new Date());
 * // ➔ "2024-02-09 14:30:45" (example output with current time)
 * formatDateTime("2023-07-01T14:30:45");
 * // ➔ "2023-07-01 14:30:45"
 * formatDateTime("2023-07-01T14:30:45", "DD/MM/YYYY");
 * // ➔ "01/07/2023"
 * formatDateTime("2023-07-01T14:30:45", "YYYY/MM/DD hh-mm-ss");
 * // ➔ "2023/07/01 14-30-45"
 * formatDateTime("2023-07-01T14:30:45", "hh:mm");
 * // ➔ "14:30"
 * formatDateTime("2023-07-01T14:30:45", "DATE: YYYY.MM.DD");
 * // ➔ "DATE: 2023.07.01"
 * formatDateTime("2023-07-01T14:30:45", "Year: YYYY, Time: hh:mm:ss");
 * // ➔ "Year: 2023, Time: 14:30:45"
 * formatDateTime("2023-07-01T14:30:45", "YYYY-MM");
 * // ➔ "2023-07"
 * formatDateTime("2023-07-01T14:30:45", "YYYYYYYY");
 * // ➔ "20232023"
 * formatDateTime("2023-07-01T14:30:45", "hh:mm:ss:ss");
 * // ➔ "14:30:45:45"
 * formatDateTime("invalid-date");
 * // ➔ null
 * formatDateTime(null);
 * // ➔ null
 * formatDateTime(undefined);
 * // ➔ null
 */
export const formatDateTime = (
  date: string | Date | null | undefined,
  format?: string
): string | null => {
  if (isNil(format)) {
    format = "YYYY-MM-DD hh:mm:ss";
  }

  if (!isString(format)) return null;

  // Handle missing or invalid date input type
  if (isNil(date) || !(isDate(date) || isNonEmptyString(date))) {
    return null;
  }

  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return null; // Handle invalid dates

    const pad2 = (n: number) => n.toString().padStart(2, "0");

    const map: Record<string, string> = {
      YYYY: parsedDate.getFullYear().toString(),
      MM: pad2(parsedDate.getMonth() + 1),
      DD: pad2(parsedDate.getDate()),
      hh: pad2(parsedDate.getHours()),
      mm: pad2(parsedDate.getMinutes()),
      ss: pad2(parsedDate.getSeconds())
    };

    const result = Object.entries(map).reduce(
      (prev, [key, value]) => prev.split(key).join(value),
      format
    );

    return !result.includes("NaN") ? result : null;
  } catch {
    return null;
  }
};

/** ----------------------------------------------------------
 * * ***Utility: `formatDateIntl`.***
 * ----------------------------------------------------------
 * **Formats a date using the `Intl.DateTimeFormat` API.**
 *  - **Features:**
 *    - Supports custom locales (type-safe `SupportedLocales`).
 *    - Accepts additional `Intl.DateTimeFormatOptions` like `timeZone`, `hour12`, etc.
 *    - Defaults to `"en-US"` if `locale` is not provided or is an empty string.
 *    - Returns `null` if the date is invalid, not provided, or options are invalid.
 * @param {string | Date | null | undefined} date The date to format.
 *    - Can be a `Date` object or an ISO string.
 *    - If invalid or not provided, returns `null`.
 * @param {FormatDateIntlOptions} [options]
 *   - Optional formatting options for `Intl.DateTimeFormat`.
 *   - Use `locale` to specify the language & region format.
 * @returns {string | null}
 *   - Formatted date string.
 *   - Returns `null` if date is invalid or options are of wrong type.
 * @example
 * formatDateIntl(new Date());
 * // ➔ "7/14/2025"
 * formatDateIntl("2025-07-14T00:00:00Z", { locale: "fr-FR", dateStyle: "long" });
 * // ➔ "14 juillet 2025"
 * formatDateIntl(null);
 * // ➔ null
 * formatDateIntl(new Date(), { timeZone: "UTC", hour: "2-digit", minute: "2-digit" });
 * // ➔ "01:30 AM"
 */
export const formatDateIntl = (
  date: string | Date | null | undefined,
  options?: FormatDateIntlOptions
): string | null => {
  if (isNil(date) || !(isDate(date) || isNonEmptyString(date))) return null;

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return null; // Handle invalid dates

  // Ensure options is an object and Defensive options check
  if (!isPlainObject(options)) {
    options = {};
  }

  const { locale = "en-US", ...restProps } = options;

  try {
    return new Intl.DateTimeFormat(
      isNonEmptyString(locale) ? locale.trim() : "en-US",
      restProps
    ).format(parsedDate);
  } catch {
    return null;
  }
};

/** ----------------------------------------------------------
 * * ***Utility: `formatDateFns`.***
 * ----------------------------------------------------------
 * Formats a date into a human-readable string using `date-fns`.
 *  - **Features:**
 *    - Supports custom output formats using `date-fns/format`.
 *    - Can parse localized non-ISO strings via `inputFormat` & `inputLocale`.
 *    - Supports `locale` as `"id"`, `"en"` or `date-fns` `Locale` objects (like `id` or `enUS`).
 *    - Returns `null` if the date is invalid, not provided, or parsing fails.
 * @param {string | Date | null | undefined} date - The date input to format. Can be:
 *   - A `Date` object
 *   - An ISO string (e.g. `"2024-01-01T12:00:00Z"`)
 *   - A localized string (requires `inputFormat` + `inputLocale`)
 * @param {FormatDateFnsOptions} [options] - Options for formatting and parsing.
 * @param {FormatDateFnsOptions["format"]} [options.format="dd MMM yyyy - HH:mm:ss"]
 *   The output format string (passed to `date-fns/format`).
 *   E.g. `"dd MMMM yyyy, HH:mm:ss" ➔ "14 Juli 2025, 17:25:42"`
 * @param {FormatDateFnsOptions["locale"]} [options.locale="id"]
 *   The output locale. If string, only `"id"` (Indonesian) or `"en"` (English)
 *   is recognized. Or you can pass a `date-fns` `Locale` object.
 *   - Example:
 *   ```ts
 *     import { ar } from "date-fns/locale";
 *     formatDateFns(new Date(), { locale: ar, format: "PPPppp" });
 *   ```
 * @param {FormatDateFnsOptions["inputLocale"]} [options.inputLocale]
 *   Required if `date` is a localized non-ISO string. Used with `inputFormat`.
 *   - Example for Indonesian string:
 *   ```ts
 *     formatDateFns("14 Juli 2025 10:25:42", { inputFormat: "dd MMMM yyyy HH:mm:ss", inputLocale: "id" });
 *   ```
 * @param {FormatDateFnsOptions["inputFormat"]} [options.inputFormat]
 *   The format string to parse `date` if it is a non-ISO string.
 *   Required together with `inputLocale`.
 * @returns {string | null} A formatted date string or `null` if input is invalid.
 * @example
 * formatDateFns(new Date());
 * // ➔ "14 Jul 2025 - 17:25:42"
 * formatDateFns("2025-07-14T10:25:42Z", { format: "dd/MM/yyyy", locale: "en" });
 * // ➔ "14/07/2025"
 * formatDateFns("14 Juli 2025 10:25:42", {
 *   inputFormat: "dd MMMM yyyy HH:mm:ss",
 *   inputLocale: "id",
 *   format: "yyyy-MM-dd"
 * });
 * // ➔ "2025-07-14"
 * formatDateFns(null);
 * // ➔ null
 */
export const formatDateFns = (
  date: string | Date | null | undefined,
  options: FormatDateFnsOptions = {}
): string | null => {
  if (isNil(date) || !(isDate(date) || isNonEmptyString(date))) return null;

  // Ensure options is an object and Defensive options check
  if (!isPlainObject(options)) {
    options = {};
  }

  const { inputFormat, locale = "en", inputLocale = "en", ...restOptions } = options;

  const format =
    hasOwnProp(options, "format") && isNonEmptyString(options.format)
      ? options.format
      : "dd MMM yyyy - HH:mm:ss";

  let parsedDate: Date;

  try {
    if (isNonEmptyString(date) && inputFormat && inputLocale) {
      const valueOfInputLocale = isNonEmptyString(inputLocale)
        ? inputLocale === "id"
          ? id
          : enUS
        : inputLocale;

      parsedDate = parse(date, inputFormat, new Date(), {
        locale: valueOfInputLocale
      });
    } else {
      parsedDate = new Date(date);
    }

    if (isNaN(parsedDate.getTime())) return null;

    const valueOfLocale = isNonEmptyString(locale)
      ? locale === "id"
        ? id
        : enUS
      : locale;

    return formatDns(parsedDate, format, {
      ...restOptions,
      locale: valueOfLocale
    });
  } catch {
    return null;
  }
};

/** ----------------------------------------------------------
 * * ***Utility: `getGMTOffset`.***
 * ----------------------------------------------------------
 * Returns the formatted GMT offset (e.g., `+0700`, `-0500`) for a given date.
 *  - **Features:**
 *    - If `date` is **not provided** or empty string, it defaults to the current date/time.
 *    - If `date` is **invalid** or of wrong type (like object or number), it returns `"0"`.
 *    - The returned string follows the **GMT offset format** (`±HHMM`), where:
 *      - `±` is `+` if ahead of UTC, `-` if behind.
 *      - `HH` is two-digit hours.
 *      - `MM` is two-digit minutes.
 * @param {string | Date | null} [date] - The date to get the GMT offset from.
 *   - Accepts `Date` object or ISO date string (e.g., `"2024-01-01T12:00:00Z"`).
 *   - If `null`, `undefined`, or empty string, uses current system date.
 *   - If invalid date or wrong type (like `123` or `{}`), returns `"0"`.
 * @returns {string} The GMT offset string in format `±HHMM`,
 *   e.g. `"+0700"`, `"-0530"`, or `"0"` if invalid.
 * @example
 * getGMTOffset();
 * // ➔ "+0700" (depends on your system timezone)
 * getGMTOffset(new Date("2024-02-09T12:00:00Z"));
 * // ➔ "+0000"
 * getGMTOffset("2024-02-09");
 * // ➔ "+0700" (depends on your system timezone)
 * getGMTOffset("invalid-date");
 * // ➔ "0"
 * getGMTOffset(123);
 * // ➔ "0"
 */
export const getGMTOffset = (date?: string | Date | null): string => {
  try {
    if (isNil(date) || (isString(date) && isEmptyString(date))) {
      date = new Date(); // Default to current date
    } else if (!(isDate(date) || isNonEmptyString(date))) {
      return "0"; // Invalid type
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return "0"; // Handle invalid dates

    const padZero = (num: number) => num.toString().padStart(2, "0");

    let offset = parsedDate.getTimezoneOffset();
    const sign = offset < 0 ? "+" : "-";
    offset = Math.abs(offset);

    return `${sign}${padZero(Math.floor(offset / 60))}${padZero(offset % 60)}`;
  } catch {
    return "0";
  }
};
