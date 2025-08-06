import {
  isArray,
  isArrayBuffer,
  isDate,
  isError,
  isObjectOrArray,
  isRegExp,
  isUndefined,
} from "@/index";
import type { IsEqualCustomizer } from "@/types/private/predicates/new/isEqualWith";

// #Private
export function baseDeepEqual(
  value: unknown,
  other: unknown,
  customizer?: IsEqualCustomizer,
  seen: WeakMap<object, object> = new WeakMap()
): boolean {
  // ✅ Strict equality (+0 === -0)
  if (value === other) return true;

  // ✅ NaN === NaN
  if (value !== value && other !== other) return true;

  // ❌ Primitives mismatch
  if (!isObjectOrArray(value) || !isObjectOrArray(other)) {
    return false;
  }

  // ✅ Prevent circular recursion
  if (seen.get(value) === other) return true;
  seen.set(value, other);

  // ✅ Customizer support
  const callCustomizer = (
    v: unknown,
    o: unknown,
    key: string | number | symbol,
    valObj: unknown,
    othObj: unknown
  ) => {
    if (customizer) {
      const result = customizer(v, o, key, valObj, othObj, seen);
      if (!isUndefined(result)) return result;
    }
    return baseDeepEqual(v, o, customizer, seen);
  };

  // ✅ Handle special instances
  if (isDate(value) && isDate(other))
    return value.getTime() === other.getTime();

  if (isRegExp(value) && isRegExp(other))
    return value.source === other.source && value.flags === other.flags;

  if (isError(value) && isError(other))
    return value.name === other.name && value.message === other.message;

  if (ArrayBuffer.isView(value) && ArrayBuffer.isView(other)) {
    const v = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
    const o = new Uint8Array(other.buffer, other.byteOffset, other.byteLength);
    if (v.length !== o.length) return false;
    for (let i = 0; i < v.length; i++) if (v[i] !== o[i]) return false;
    return true;
  }

  if (isArrayBuffer(value) && isArrayBuffer(other)) {
    if (value.byteLength !== other.byteLength) return false;
    const v = new Uint8Array(value),
      o = new Uint8Array(other);
    for (let i = 0; i < v.length; i++) if (v[i] !== o[i]) return false;
    return true;
  }

  if (value instanceof Map && other instanceof Map) {
    if (value.size !== other.size) return false;
    for (const [k, v] of value) {
      if (!other.has(k)) return false;
      if (!baseDeepEqual(v, other.get(k), customizer, seen)) return false;
    }
    return true;
  }

  if (value instanceof Set && other instanceof Set) {
    if (value.size !== other.size) return false;
    for (const v of value) {
      let matched = false;
      for (const o of other) {
        if (baseDeepEqual(v, o, customizer, seen)) {
          matched = true;
          break;
        }
      }
      if (!matched) return false;
    }
    return true;
  }

  if (isArray(value) && isArray(other)) {
    if (value.length !== other.length) return false;
    for (let i = 0; i < value.length; i++) {
      if (!callCustomizer(value[i], other[i], i, value, other)) return false;
    }
    return true;
  }

  if (Object.getPrototypeOf(value) !== Object.getPrototypeOf(other)) {
    return false;
  }

  const vKeys = Reflect.ownKeys(value);
  const oKeys = Reflect.ownKeys(other);
  if (vKeys.length !== oKeys.length) return false;

  for (const key of vKeys) {
    const vVal = (value as Record<PropertyKey, unknown>)[key];
    const oVal = (other as Record<PropertyKey, unknown>)[key];
    if (!callCustomizer(vVal, oVal, key, value, other)) return false;
  }

  return true;
}
