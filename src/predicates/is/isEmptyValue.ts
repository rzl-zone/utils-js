import { isNaN } from "./isNaN";
import { isNil } from "./isNil";
import { isArray } from "./isArray";
import { isObject } from "./isObject";
import { isString } from "./isString";
import { isEmptyArray } from "./isEmptyArray";
import { hasOwnProp } from "../has/hasOwnProp";
import { isEmptyObject } from "./isEmptyObject";
import { isEmptyString } from "./isEmptyString";

import { assertIsBoolean } from "@/assertions/booleans/assertIsBoolean";
import { assertIsPlainObject } from "@/assertions/objects/assertIsPlainObject";

type IsEmptyValueOptions = {
  /** **Whether to check symbol properties when checking empty objects.**
   * - **DefaultValue:** `false`.
   *
   * @default false
   */
  checkSymbols?: boolean;
};

/** ----------------------------------------------------------
 * * ***Predicate: `isEmptyValue`.***
 * ----------------------------------------------------------
 * **Determines if a value is **`empty`**.**
 * - **Covering:**
 *    - Empty objects: `{}`
 *    - Empty arrays: `[]`
 *    - Empty strings: `""` or whitespace-only (trimmed)
 *    - `null`, `undefined`, `false`, or `NaN`
 * - **Returns **`false`** for:**
 *    - Non-empty objects/arrays
 *    - Non-empty strings
 *    - Numbers (except `NaN`)
 *    - `Functions`, `true`, `symbols`, `etc`.
 * @param {*} value - The value to evaluate.
 * @param {IsEmptyValueOptions} [options] - Optional settings.
 * @returns {boolean} Return `true` if the value is considered empty, otherwise `false`.
 * @example
 * isEmptyValue({});
 * // ➔ true
 * isEmptyValue([]);
 * // ➔ true
 * isEmptyValue({ key: "value" });
 * // ➔ false
 * isEmptyValue({ [Symbol("foo")]: 123 });
 * // ➔ true (default `checkSymbols` is `false`)
 * isEmptyValue({ [Symbol("foo")]: 123 }, { checkSymbols: false });
 * // ➔ true (default `checkSymbols` is `false`)
 * isEmptyValue({ [Symbol("foo")]: 123 }, { checkSymbols: true });
 * // ➔ false
 * isEmptyValue([1, 2, 3]);
 * // ➔ false
 * isEmptyValue(NaN);
 * // ➔ true
 * isEmptyValue(true);
 * // ➔ false
 * isEmptyValue(false);
 * // ➔ true
 * isEmptyValue(null);
 * // ➔ true
 * isEmptyValue(undefined);
 * // ➔ true
 * isEmptyValue("");
 * // ➔ true
 * isEmptyValue("   ");
 * // ➔ true
 * isEmptyValue(0);
 * // ➔ false
 * isEmptyValue(-1);
 * // ➔ false
 * isEmptyValue(2);
 * // ➔ false
 * isEmptyValue(() => {});
 * // ➔ false
 */
export const isEmptyValue = (
  value: unknown,
  options: IsEmptyValueOptions = {}
): boolean => {
  assertIsPlainObject(options, {
    message: ({ currentType, validType }) =>
      `Second parameter (\`options\`) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });

  const checkSymbols = hasOwnProp(options, "checkSymbols") ? options.checkSymbols : false;

  assertIsBoolean(checkSymbols, {
    message: ({ currentType, validType }) =>
      `Parameter \`checkSymbols\` property of the \`options\` (second parameter) must be of type \`${validType}\`, but received: \`${currentType}\`.`
  });

  if (isNil(value) || value === false || isNaN(value)) return true;
  if (isString(value)) return isEmptyString(value);
  if (isArray(value)) return isEmptyArray(value);
  if (isObject(value)) {
    return isEmptyObject(value, { checkSymbols });
  }

  return false;
};
