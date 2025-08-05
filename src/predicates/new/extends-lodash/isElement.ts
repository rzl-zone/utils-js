import { isPlainObject } from "@/index";

/** ----------------------------------------------------
 * * ***Checks if `value` is likely a DOM element.***
 * ----------------------------------------------------
 *
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a DOM element, else `false`.
 * @example
 *
 * isElement(document.body);
 * // => true
 *
 * isElement('<body>');
 * // => false
 *
 * isElement(document.createElement("div"));
 * // => true
 */
export function isElement(value: unknown): boolean {
  return (
    !!value &&
    typeof value === "object" &&
    (value as unknown as Element).nodeType === 1 &&
    !isPlainObject(value)
  );
  // return typeof Element === "function" && value instanceof Element;
}
