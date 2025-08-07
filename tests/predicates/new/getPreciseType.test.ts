import { describe, it, expect } from "vitest";
import { getPreciseType } from "@/predicates/new/getPreciseType";

describe("getPreciseType — comprehensive", () => {
  const cases: Array<{ value: unknown; expected: string; name: string }> = [
    // primitives
    { value: "abc", expected: "String", name: `string "abc"` },
    { value: 123, expected: "Number", name: "number 123" },
    { value: 123n, expected: "Big Int", name: "bigint 123n" },
    { value: true, expected: "Boolean", name: "boolean true" },
    { value: Symbol("x"), expected: "Symbol", name: "symbol" },
    { value: undefined, expected: "Undefined", name: "undefined" },
    { value: null, expected: "Null", name: "null" },

    // common objects
    { value: [], expected: "Array", name: "Array []" },
    { value: {}, expected: "Object", name: "plain object {}" },
    { value: new Date(), expected: "Date", name: "Date" },
    { value: /abc/, expected: "Reg Exp", name: "RegExp /abc/" },
    { value: new Error("x"), expected: "Error", name: "Error" },

    // collections
    { value: new Map(), expected: "Map", name: "Map" },
    { value: new Set(), expected: "Set", name: "Set" },
    { value: new WeakMap(), expected: "Weak Map", name: "WeakMap" },
    { value: new WeakSet(), expected: "Weak Set", name: "WeakSet" },

    // binary / buffer
    {
      value: new ArrayBuffer(8),
      expected: "Array Buffer",
      name: "ArrayBuffer",
    },
    // SharedArrayBuffer may not exist in older runtimes — we'll push conditionally below
    {
      value: new DataView(new ArrayBuffer(8)),
      expected: "Data View",
      name: "DataView",
    },

    // typed arrays
    { value: new Int8Array(), expected: "Int 8 Array", name: "Int8Array" },
    { value: new Uint8Array(), expected: "Uint 8 Array", name: "Uint8Array" },
    {
      value: new Uint8ClampedArray(),
      expected: "Uint 8 Clamped Array",
      name: "Uint8ClampedArray",
    },
    { value: new Int16Array(), expected: "Int 16 Array", name: "Int16Array" },
    {
      value: new Uint16Array(),
      expected: "Uint 16 Array",
      name: "Uint16Array",
    },
    { value: new Int32Array(), expected: "Int 32 Array", name: "Int32Array" },
    {
      value: new Uint32Array(),
      expected: "Uint 32 Array",
      name: "Uint32Array",
    },
    {
      value: new Float32Array(),
      expected: "Float 32 Array",
      name: "Float32Array",
    },
    {
      value: new Float64Array(),
      expected: "Float 64 Array",
      name: "Float64Array",
    },
    {
      value: new BigInt64Array(),
      expected: "Big Int 64 Array",
      name: "BigInt64Array",
    },
    {
      value: new BigUint64Array(),
      expected: "Big Uint 64 Array",
      name: "BigUint64Array",
    },

    // functions / generators / async
    { value: function () {}, expected: "Function", name: "regular function" },
    { value: () => {}, expected: "Function", name: "arrow function" },
    {
      value: async function () {},
      expected: "Async Function",
      name: "async function",
    },
    {
      value: function* () {},
      expected: "Generator Function",
      name: "generator function",
    },
    // generator instance (iterator)
    // we'll create the instance below and push conditionally

    // promise
    {
      value: Promise.resolve(),
      expected: "Promise",
      name: "Promise.resolve()",
    },

    // NaN should still be number
    { value: NaN, expected: "Number", name: "NaN" },

    // some edge cases (Object.create(null), custom class, proxy)
    {
      value: Object.create(null),
      expected: "Object",
      name: "Object.create(null)",
    },
    {
      value: new (class Foo {})(),
      expected: "Object",
      name: "custom class instance",
    },
    { value: new Proxy({}, {}), expected: "Object", name: "Proxy({})" },

    // arguments object (created inside a function to get "Arguments" internal class)
    // we'll create it below and push conditionally
  ];

  // conditional additions for environment-specific globals
  if (typeof SharedArrayBuffer !== "undefined") {
    cases.push({
      value: new SharedArrayBuffer(8),
      expected: "Shared Array Buffer",
      name: "SharedArrayBuffer",
    });
  } else {
    // skip test but keep coverage info via a skipped test later
  }

  if (typeof FinalizationRegistry !== "undefined") {
    cases.push({
      value: new FinalizationRegistry(() => {}),
      expected: "Finalization Registry",
      name: "FinalizationRegistry",
    });
  }

  if (typeof WeakRef !== "undefined") {
    cases.push({
      value: new WeakRef({}),
      expected: "Weak Ref",
      name: "WeakRef",
    });
  }

  // generator instance
  const genFn = function* () {
    yield 1;
  };
  const genInstance = genFn();
  cases.push({
    value: genInstance,
    expected: "Generator",
    name: "generator instance",
  });

  // arguments object
  const argsObj = (function (...arg: number[]) {
    return arguments;
  })(1, 2, 3);
  cases.push({
    value: argsObj,
    expected: "Arguments",
    name: "arguments object",
  });

  // run tests
  for (const c of cases) {
    it(`returns "${c.expected}" for ${c.name}`, () => {
      expect(getPreciseType(c.value)).toBe(c.expected);
    });
  }

  // Additional sanity checks: ensure some things don't regress
  it("treats numeric-like types correctly", () => {
    expect(getPreciseType(0)).toBe("Number");
    expect(getPreciseType(-1)).toBe("Number");
    expect(getPreciseType(0n)).toBe("Big Int");
  });

  it("handles nested / wrapped values", () => {
    expect(getPreciseType([[]])).toBe("Array");
    expect(getPreciseType({ a: { b: 1 } })).toBe("Object");
  });
});
