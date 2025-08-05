type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array;

/** --------------------------------------------------
 * * ***Checks if `value` is classified as a typed array.***
 * --------------------------------------------------
 *
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 *
 * isTypedArray(new Uint8Array);          // => true
 * isTypedArray(new Uint8Array());        // => true
 * isTypedArray(new Float32Array());      // => true
 * isTypedArray(new Uint8ClampedArray()); // => true
 * isTypedArray([]);                      // => false
 * isTypedArray(Buffer.from("hi"));       // => false
 */
export function isTypedArray(value: unknown): value is TypedArray {
  return (
    value != null &&
    typeof value === "object" &&
    typedArrayTags.has(Object.prototype.toString.call(value))
  );
}

const typedArrayTags = new Set([
  "[object Int8Array]",
  "[object Uint8Array]",
  "[object Uint8ClampedArray]",
  "[object Int16Array]",
  "[object Uint16Array]",
  "[object Int32Array]",
  "[object Uint32Array]",
  "[object Float32Array]",
  "[object Float64Array]",
  "[object BigInt64Array]",
  "[object BigUint64Array]",
]);
