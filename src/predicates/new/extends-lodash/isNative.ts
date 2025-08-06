import type { AnyFunction } from "@/types";

const funcToString = Function.prototype.toString;
const reIsNative = /\{\s*\[native code\]\s*\}/;

/** ----------------------------------------------------
 * * ***Checks if `value` is a pristine native function.***
 * ----------------------------------------------------
 *
 * **Note:** This method can't reliably detect native functions in the presence
 * of the core-js package because core-js circumvents this kind of detection.
 * Despite multiple requests, the core-js maintainer has made it clear: any
 * attempt to fix the detection will be obstructed. As a result, we're left
 * with little choice but to throw an error. Unfortunately, this also affects
 * packages, like [babel-polyfill](https://www.npmjs.com/package/babel-polyfill),
 * which rely on core-js.
 *
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 * @example
 *
 * isNative(Array.prototype.push);
 * // => true
 *
 * import * as RzlUtilsJs from "@rzl-zone/utils-js";
 * isNative(RzlUtilsJs);
 * // => false
 */
export function isNative(value?: unknown): value is AnyFunction {
  if (typeof value !== "function") return false;

  try {
    const source = funcToString.call(value);
    return reIsNative.test(source);
  } catch {
    return false;
  }
}
