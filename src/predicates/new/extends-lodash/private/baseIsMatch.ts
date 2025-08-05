import { isMatchWith, isObjectOrArray } from "@/index";
import type { isMatchWithCustomizer } from "@/types/private/predicates/new/isMatchWith";

// #Private - local
function isSameValue(x: unknown, y: unknown): boolean {
  return (
    x === y || (x === 0 && y === 0) || (Number.isNaN(x) && Number.isNaN(y))
  );
}

// #Private
export function baseIsMatch(
  object: unknown,
  source: unknown,
  customizer?: isMatchWithCustomizer
): boolean {
  if (object === source) return true;

  if (source === null || typeof source !== "object") {
    return isSameValue(object, source);
  }

  if (object === null || typeof object !== "object") {
    return false;
  }

  const keys = Reflect.ownKeys(source as object).filter(
    (k) => !(Array.isArray(source) && k === "length")
  );

  for (const key of keys) {
    if (!(key in object)) return false;

    const objValue = (object as Record<string | symbol, unknown>)[key];
    const srcValue = (source as Record<string | symbol, unknown>)[key];

    const result = customizer?.(
      objValue,
      srcValue,
      key,
      object as object,
      source as object
    );
    if (result !== undefined) {
      if (!result) return false;
      continue; // skip default comparison
    }

    if (isObjectOrArray(objValue) && isObjectOrArray(srcValue)) {
      if (!isMatchWith(objValue as object, srcValue as object, customizer))
        return false;
    } else {
      if (!isSameValue(objValue, srcValue)) return false;
    }
  }

  return true;
}
