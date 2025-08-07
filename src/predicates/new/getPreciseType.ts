/**
 * Convert a string to PascalCase words separated by spaces.
 * Examples:
 * - "BigInt64Array" → "Big Int 64 Array"
 * - "finalizationregistry" → "Finalization Registry"
 */
const toSpacedPascalCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2") // lower → upper
    .replace(/([a-zA-Z])(\d)/g, "$1 $2") // letter → number
    .replace(/(\d)([a-zA-Z])/g, "$1 $2") // number → letter
    .replace(/\s+/g, " ")
    .trim()
    .replace(
      /\w\S*/g,
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
};

/** ----------------------------------------------------
 * * ***Get the precise JavaScript type of any value.***
 * ----------------------------------------------------
 *
 * Features:
 * - Handles all ECMAScript built-in types, including edge cases and naming inconsistencies.
 * - Always returns result in PascalCase with spaces (e.g., "Big Uint 64 Array").
 * - Normalizes incorrect or environment-specific type names (e.g., "finalizationregistry" → "FinalizationRegistry").
 *
 * @param value - The value to check.
 * @returns The precise type name in PascalCase with spaces.
 *
 * Examples:
 * ```ts
 * getPreciseType([]); // "Array"
 * getPreciseType(new Map()); // "Map"
 * getPreciseType(new FinalizationRegistry(() => {})); // "Finalization Registry"
 * getPreciseType(BigInt(10)); // "Big Int"
 * ```
 */
export const getPreciseType = (value: unknown): string => {
  const fixes: Record<string, string> = {
    // Primitives
    string: "String",
    number: "Number",
    boolean: "Boolean",
    bigint: "BigInt",
    symbol: "Symbol",
    undefined: "Undefined",
    null: "Null",

    // Core objects
    object: "Object",
    array: "Array",
    function: "Function",
    regexp: "RegExp",
    date: "Date",
    error: "Error",

    // Typed arrays
    int8array: "Int8Array",
    uint8array: "Uint8Array",
    uint8clampedarray: "Uint8ClampedArray",
    int16array: "Int16Array",
    uint16array: "Uint16Array",
    int32array: "Int32Array",
    uint32array: "Uint32Array",
    float32array: "Float32Array",
    float64array: "Float64Array",
    bigint64array: "BigInt64Array",
    biguint64array: "BigUint64Array",

    // Binary data
    arraybuffer: "ArrayBuffer",
    sharedarraybuffer: "SharedArrayBuffer",
    dataview: "DataView",

    // Collections
    map: "Map",
    set: "Set",
    weakmap: "WeakMap",
    weakset: "WeakSet",

    // Special / async
    promise: "Promise",
    generator: "Generator",
    generatorfunction: "GeneratorFunction",
    asyncfunction: "AsyncFunction",

    // ES2021+
    finalizationregistry: "FinalizationRegistry",
    weakref: "WeakRef",
  };

  if (value === null) return fixes["null"];

  const primitiveType = typeof value;
  if (primitiveType !== "object" && primitiveType !== "function") {
    return toSpacedPascalCase(fixes[primitiveType] ?? primitiveType);
  }

  let typeName = Object.prototype.toString.call(value).slice(8, -1); // "[object Something]" → "Something"

  const fixed = fixes[typeName.toLowerCase()];
  if (fixed) typeName = fixed;

  return toSpacedPascalCase(typeName);
};
