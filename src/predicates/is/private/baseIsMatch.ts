import type { CustomizerIsMatchWith } from "@/types/private";

import { isArray } from "../isArray";
import { isUndefined } from "../isUndefined";
import { isMatchWith } from "../isMatchWith";
import { isObjectOrArray } from "../isObjectOrArray";

// #Private - local
function isSameValue(x: unknown, y: unknown): boolean {
  return x === y || (x === 0 && y === 0) || (Number.isNaN(x) && Number.isNaN(y));
}

// #Private
export function baseIsMatch(
  object: unknown,
  source: unknown,
  customizer?: CustomizerIsMatchWith
): boolean {
  if (object === source) return true;

  if (!isObjectOrArray(source)) {
    return isSameValue(object, source);
  }

  if (!isObjectOrArray(object)) {
    return false;
  }

  const keys = Reflect.ownKeys(source).filter(
    (k) => !(isArray(source) && k === "length")
  );

  for (const key of keys) {
    if (!(key in object)) return false;

    const objValue = object[key];
    const srcValue = source[key];

    const result = customizer?.(objValue, srcValue, key, object, source);
    if (!isUndefined(result)) {
      if (!result) return false;
      continue; // skip default comparison
    }

    if (isObjectOrArray(objValue) && isObjectOrArray(srcValue)) {
      if (!isMatchWith(objValue, srcValue, customizer)) return false;
    } else {
      if (!isSameValue(objValue, srcValue)) return false;
    }
  }

  return true;
}
