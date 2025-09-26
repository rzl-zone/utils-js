import type { AnyString, PickStrict, Prettify } from "@rzl-zone/ts-types-plus";

import { isFunction } from "@/predicates/is/isFunction";
import { isPlainObject } from "@/predicates/is/isPlainObject";
import { isNonEmptyString } from "@/predicates/is/isNonEmptyString";

import {
  type GetPreciseTypeOptions,
  getPreciseType
} from "@/predicates/type/getPreciseType";
import { FIXES_RAW } from "@/predicates/type/_private/getPreciseType.utils";
import { toKebabCase } from "@/strings/cases/toKebabCase";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const validType = Object.values({
  ...FIXES_RAW,
  plainobject: "Plain Object"
} as const);
type RequiredValidType =
  | Lowercase<(typeof validType)[number]>
  | Capitalize<(typeof validType)[number]>
  | Uppercase<(typeof validType)[number]>
  | AnyString;

/** -------------------------------------------------------
 * * ***Shape of the object passed to custom error message functions.***
 * -------------------------------------------------------
 * **This type describes the parameters received when `options.message`
 * is defined as a function in {@link OptionsAssertIs | `OptionsAssertIs`}.**
 * - **Parameter:**
 *    - `currentType` ➔ the actual detected runtime type of the value.
 *    - `validType`   ➔ the required/expected type name that the value must match.
 * @example
 * ```ts
 * const options: OptionsAssertIs = {
 *   message: ({ currentType, validType }) => {
 *     return `Expected ${validType} but got ${currentType}`;
 *   };
 * };
 * ```
 */
export type OptionsMessageFunctionAssertIs = {
  /** ---------------------------------------------------------------------------
   * * ***The actual runtime type of the value being checked.***
   * ---------------------------------------------------------------------------
   * - ***Example:***
   *    - `"number"`, `"big-int"`, `"plain-object"`, (depends `formatCase` options).
   */
  currentType: string;

  /** ---------------------------------------------------------------------------
   * * ***The required/expected type that the value must conform to.***
   * ---------------------------------------------------------------------------
   * - ***Example:***
   *    - `"boolean"`, `"string"`, `"big-int"`, `"plain-object"`, (will force format to `kebab-case`).
   */
  validType: string;
};

/** -------------------------------------------------------
 * * ***Custom error-message type for assertions option {@link OptionsAssertIs | `OptionsAssertIs`}.***
 * -------------------------------------------------------
 * - ***Accepts:***
 *    - A static string message.
 *    - A function receiving `{ currentType, validType }` and returning a string.
 */
type OptionsMessageAssertIs =
  | string
  | (({ currentType, validType }: OptionsMessageFunctionAssertIs) => string);

/** ---------------------------------------------------------------------------
 * * ***Base options for `assertIs*` functions.***
 * ---------------------------------------------------------------------------
 */
export type OptionsAssertIs = Prettify<
  {
    /** -------------------------------------------------------
     * * ***Custom error message for assertion failures.***
     * -------------------------------------------------------
     * **This option allows overriding the **default error message** when a value
     * does not match the required type.**
     * - If a **string** is provided:
     *    - Must be non-empty after trimming.
     *    - Will be used directly as the error message.
     * - If a **function** is provided:
     *    - Receives an object containing:
     *      - `currentType` ➔ the detected runtime type of the value (depends `formatCase` options, e.g., `"number"`).
     *      - `validType`  ➔ the expected type name (with format `kebab-case`, e.g., `"boolean"`, `"big-int"`, `"plain-object"`).
     *    - **Must** return a **string**:
     *      - **If** the **returned string is** `empty` or `whitespace`,
     *        the **default message** will be used instead.
     * @example
     * ```ts
     * // Static message
     * { message: "Must be a boolean!" }
     *
     * // Dynamic message
     * {
     *   message: ({ currentType, validType }) => {
     *     return `Expected ${validType} but got ${currentType}`;
     *   };
     * }
     * ```
     */
    message?: OptionsMessageAssertIs;
  } & PickStrict<GetPreciseTypeOptions, "formatCase">,
  { recursive: true }
>;

type ParamsResolveErrorMessageAssertions<T> = {
  value: T;
  options?: OptionsAssertIs;
  requiredValidType: RequiredValidType;
};

/** -------------------------------------------------------
 * * ***Resolve a custom error message for type assertions.***
 * -------------------------------------------------------
 * **Produces the **final error message** used by assertion functions (`assertIs*`).**
 * - **Message resolution follows this order:**
 *    1. **Function message** ➔ If `options.message` is a function, it is invoked with:
 *        - `currentType`: the detected runtime type of `value`.
 *        - `validType`: the required/expected type name.
 *        - If the function returns a non-empty string, it is used, otherwise, the default message is used.
 *    2. **String message** ➔ If `options.message` is a non-empty string, it is used directly.
 *    3. **Fallback** ➔ If no valid message is provided, a default message is generated:
 *    ```ts
 *       "Parameter input (`value`) must be of type `<validType>`, but received: `<currentType>`."
 *    ```
 * @private
 * @template T - The type of the value being checked.
 * @param {ParamsResolveErrorMessageAssertions<T>} params - Parameters object.
 * @param {ParamsResolveErrorMessageAssertions<T>["value"]} params.value - The value being asserted.
 * @param {ParamsResolveErrorMessageAssertions<T>["options"]} [params.options] - Optional configuration for message and type formatting.
 * @param {ParamsResolveErrorMessageAssertions<T>["requiredValidType"]} [params.requiredValidType] - The required type name that the value should have.
 * @returns A non-empty, trimmed error message string.
 * @example
 * ```ts
 * // 1. Using a static string message
 * const msg = resolveErrorMessageAssertions({
 *   value: 42,
 *   options: { message: "Must be a boolean!" },
 *   requiredValidType: "boolean"
 * });
 * // ➔ "Must be a boolean!"
 *
 * // 2. Using a function to dynamically generate the message
 * const msgFn = resolveErrorMessageAssertions({
 *   value: 42,
 *   options: {
 *     message: ({ currentType, validType }) =>
 *       `Expected ${validType} but got ${currentType}.`
 *   },
 *   requiredValidType: "boolean"
 * });
 * // ➔ "Expected boolean but got number."
 *
 * // 3. Without providing a custom message ➔ uses default
 * const defaultMsg = resolveErrorMessageAssertions({
 *   value: 42,
 *   requiredValidType: "boolean"
 * });
 * // ➔ "Parameter input (`value`) must be of type `boolean`, but received: `number`."
 * ```
 */
export function resolveErrorMessageAssertions<T>(
  params: ParamsResolveErrorMessageAssertions<T>
): string {
  const { requiredValidType, value, options } = params || {};

  const { message, formatCase } = isPlainObject(options) ? options : {};

  const validType = toKebabCase(requiredValidType);
  const currentType = getPreciseType(value, { formatCase });
  const messageFnOptions = { currentType, validType };

  const defaultMessage = `Parameter input (\`value\`) must be of type \`${validType}\`, but received: \`${currentType}\`.`;

  const errorMessage = isFunction(message)
    ? isNonEmptyString(message(messageFnOptions))
      ? message(messageFnOptions).trim()
      : defaultMessage
    : isNonEmptyString(message)
    ? message.trim()
    : defaultMessage;

  return errorMessage;
}
