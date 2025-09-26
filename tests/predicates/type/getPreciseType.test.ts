import { describe, it, expect } from "vitest";
import { toLowerCase } from "@/strings/cases/toLowerCase";
import { getPreciseType } from "@/predicates/type/getPreciseType";
import { __internalAcronyms__ } from "@/predicates/type/_private/getPreciseType.utils";

describe("getPreciseType — ultra comprehensive", () => {
  /**
   * Main test cases array.
   * Each case tests:
   * - value: input to getPreciseType
   * - expected: expected returned string type
   * - name: human-readable description for test reporting
   */
  const cases: Array<{ value: unknown; expected: string; name: string }> = [
    // --- Primitive Types ---
    { value: "abc", expected: "String", name: "string 'abc'" },
    { value: "", expected: "String", name: "empty string" },
    { value: 123, expected: "Number", name: "number 123" },
    { value: 0, expected: "Number", name: "number zero" },
    { value: -1, expected: "Number", name: "number negative" },
    { value: 123n, expected: "Big Int", name: "bigint 123n" },
    { value: 0n, expected: "Big Int", name: "bigint zero" },
    { value: true, expected: "Boolean", name: "boolean true" },
    { value: false, expected: "Boolean", name: "boolean false" },
    { value: Symbol("sym"), expected: "Symbol", name: "symbol" },

    { value: null, expected: "Null", name: "null" },
    { value: undefined, expected: "Undefined", name: "undefined" },

    // Special Number
    { value: NaN, expected: "NaN", name: "NaN (special number)" },
    { value: Infinity, expected: "Infinity", name: "Infinity (special number)" },
    { value: -Infinity, expected: "-Infinity", name: "-Infinity (special number)" },

    // Boxed Primitive
    {
      value: new String(),
      expected: "String Constructor",
      name: "new String() (Special String Constructor)"
    },
    {
      value: new Number(),
      expected: "Number Constructor",
      name: "new Number() (Special Number Constructor)"
    },
    {
      value: new Boolean(),
      expected: "Boolean Constructor",
      name: "new Boolean() (Special Boolean Constructor)"
    },

    // --- Core JS Objects ---
    { value: {}, expected: "Object", name: "plain object {}" },
    {
      value: Object.create(null),
      expected: "Object",
      name: "Object.create(null)"
    },
    {
      value: new (class Custom {})(),
      expected: "Object",
      name: "custom class instance"
    },
    { value: [], expected: "Array", name: "empty array []" },
    { value: new Array(3), expected: "Array", name: "array with length 3" },
    { value: function () {}, expected: "Function", name: "regular function" },
    { value: () => {}, expected: "Function", name: "arrow function" },
    {
      value: async function () {},
      expected: "Async Function",
      name: "async function"
    },
    {
      value: function* () {},
      expected: "Generator Function",
      name: "generator function"
    },
    {
      value: async function* () {},
      expected: "Async Generator Function",
      name: "async generator function"
    },
    { value: /regex/, expected: "Reg Exp", name: "RegExp literal" },
    { value: new Date(), expected: "Date", name: "Date instance" },
    { value: new Error("err"), expected: "Error", name: "Error instance" },

    // --- Error Subclasses ---
    { value: new EvalError(), expected: "Eval Error", name: "EvalError" },
    { value: new RangeError(), expected: "Range Error", name: "RangeError" },
    {
      value: new ReferenceError(),
      expected: "Reference Error",
      name: "ReferenceError"
    },
    { value: new SyntaxError(), expected: "Syntax Error", name: "SyntaxError" },
    { value: new TypeError(), expected: "Type Error", name: "TypeError" },
    { value: new URIError(), expected: "URI Error", name: "URIError" },
    {
      value: new AggregateError([]),
      expected: "Aggregate Error",
      name: "AggregateError"
    },

    // --- Collections ---
    { value: new Map(), expected: "Map", name: "Map instance" },
    { value: new Set(), expected: "Set", name: "Set instance" },
    { value: new WeakMap(), expected: "Weak Map", name: "WeakMap instance" },
    { value: new WeakSet(), expected: "Weak Set", name: "WeakSet instance" },

    // --- Binary Data ---
    {
      value: new ArrayBuffer(16),
      expected: "Array Buffer",
      name: "ArrayBuffer"
    },
    {
      value: new DataView(new ArrayBuffer(16)),
      expected: "Data View",
      name: "DataView"
    }
  ];

  // Conditionally add SharedArrayBuffer
  if (typeof SharedArrayBuffer !== "undefined") {
    cases.push({
      value: new SharedArrayBuffer(16),
      expected: "Shared Array Buffer",
      name: "SharedArrayBuffer"
    });
  }

  // --- Typed Arrays ---
  cases.push(
    { value: new Int8Array(), expected: "Int 8 Array", name: "Int8Array" },
    { value: new Uint8Array(), expected: "Uint 8 Array", name: "Uint8Array" },
    {
      value: new Uint8ClampedArray(),
      expected: "Uint 8 Clamped Array",
      name: "Uint8ClampedArray"
    },
    { value: new Int16Array(), expected: "Int 16 Array", name: "Int16Array" },
    {
      value: new Uint16Array(),
      expected: "Uint 16 Array",
      name: "Uint16Array"
    },
    { value: new Int32Array(), expected: "Int 32 Array", name: "Int32Array" },
    {
      value: new Uint32Array(),
      expected: "Uint 32 Array",
      name: "Uint32Array"
    },
    {
      value: new Float32Array(),
      expected: "Float 32 Array",
      name: "Float32Array"
    },
    {
      value: new Float64Array(),
      expected: "Float 64 Array",
      name: "Float64Array"
    },
    {
      value: new BigInt64Array(),
      expected: "Big Int 64 Array",
      name: "BigInt64Array"
    },
    {
      value: new BigUint64Array(),
      expected: "Big Uint 64 Array",
      name: "BigUint64Array"
    }
  );

  // --- Promise and Async ---
  cases.push({
    value: Promise.resolve(123),
    expected: "Promise",
    name: "Promise resolved"
  });

  // --- Iterators ---
  cases.push(
    {
      value: new Map().keys(),
      expected: "Map Iterator",
      name: "Map Iterator (keys)"
    },
    {
      value: new Map().values(),
      expected: "Map Iterator",
      name: "Map Iterator (values)"
    },
    {
      value: new Set().keys(),
      expected: "Set Iterator",
      name: "Set Iterator (keys)"
    },
    {
      value: new Set().values(),
      expected: "Set Iterator",
      name: "Set Iterator (values)"
    },
    {
      value: [][Symbol.iterator](),
      expected: "Array Iterator",
      name: "Array Iterator"
    },
    {
      value: ""[Symbol.iterator](),
      expected: "String Iterator",
      name: "String Iterator"
    },
    {
      value: (function* () {
        yield 1;
      })(),
      expected: "Generator",
      name: "Generator instance"
    },
    {
      value: (function* () {
        yield 2;
      })(),
      expected: "Generator",
      name: "Generator instance (duplicate)"
    }
  );

  // --- Arguments object ---
  (function (...arg: unknown[]) {
    cases.push({
      value: arguments,
      expected: "Arguments",
      name: "Arguments object"
    });
  })(1, 2, 3);

  // --- Proxy ---
  cases.push({
    value: new Proxy({}, {}),
    expected: "Object",
    name: "Proxy object"
  });

  // --- Global Singletons ---
  cases.push(
    { value: Math, expected: "Math", name: "Math object" },
    { value: JSON, expected: "JSON", name: "JSON object" }
  );

  // --- Intl objects (conditionally) ---
  if (typeof Intl !== "undefined") {
    cases.push(
      { value: Intl, expected: "Intl", name: "Intl namespace" },
      {
        value: new Intl.Collator(),
        expected: "Intl Collator",
        name: "Intl.Collator instance"
      },
      {
        value: new Intl.DateTimeFormat(),
        expected: "Intl Date Time Format",
        name: "Intl.DateTimeFormat instance"
      },
      {
        value: new Intl.ListFormat("en"),
        expected: "Intl List Format",
        name: "Intl.ListFormat instance"
      },
      {
        value: new Intl.NumberFormat(),
        expected: "Intl Number Format",
        name: "Intl.NumberFormat instance"
      },
      {
        value: new Intl.PluralRules(),
        expected: "Intl Plural Rules",
        name: "Intl.PluralRules instance"
      },
      {
        value: new Intl.RelativeTimeFormat(),
        expected: "Intl Relative Time Format",
        name: "Intl.RelativeTimeFormat instance"
      }
    );

    if (typeof Intl.Segmenter !== "undefined") {
      cases.push({
        value: new Intl.Segmenter(),
        expected: "Intl Segmenter",
        name: "Intl.Segmenter instance"
      });
    }
    if (typeof Intl.Locale !== "undefined") {
      cases.push({
        value: new Intl.Locale("en"),
        expected: "Intl Locale",
        name: "Intl.Locale instance"
      });
    }
  }

  // --- Atomics (conditionally) ---
  if (typeof Atomics !== "undefined") {
    cases.push({
      value: Atomics,
      expected: "Atomics",
      name: "Atomics object"
    });
  }

  // --- Reflect ---
  cases.push({
    value: Reflect,
    expected: "Reflect",
    name: "Reflect object"
  });

  // --- Web Streams API (conditionally) ---
  if (typeof ReadableStream !== "undefined") {
    cases.push({
      value: new ReadableStream(),
      expected: "Readable Stream",
      name: "ReadableStream instance"
    });
  }
  if (typeof WritableStream !== "undefined") {
    cases.push({
      value: new WritableStream(),
      expected: "Writable Stream",
      name: "WritableStream instance"
    });
  }
  if (typeof TransformStream !== "undefined") {
    cases.push({
      value: new TransformStream(),
      expected: "Transform Stream",
      name: "TransformStream instance"
    });
  }

  // --- Performance API (conditionally) ---
  if (typeof performance !== "undefined") {
    cases.push({
      value: performance,
      expected: "Performance",
      name: "Performance object"
    });
  }
  if (typeof PerformanceObserver !== "undefined") {
    cases.push({
      value: new PerformanceObserver(() => {}),
      expected: "Performance Observer",
      name: "PerformanceObserver instance"
    });
  }

  // --- Node.js-specific types (if you want to add them) ---
  // e.g. Buffer, process, etc.
  if (typeof Buffer !== "undefined") {
    cases.push({
      value: Buffer.from("test"),
      expected: "Buffer",
      name: "Node.js Buffer instance"
    });
  }
  if (typeof process !== "undefined") {
    cases.push({
      value: process,
      expected: "Process",
      name: "Node.js process object"
    });
  }

  // --- Run all test cases ---
  const SPECIAL_CASES = ["-Infinity", "Infinity", "NaN"];

  // for (const c of cases) {
  cases.forEach((c) => {
    it(`returns "${c.expected}" for ${c.name}`, () => {
      const valueToConvert = SPECIAL_CASES.includes(c.expected)
        ? c.expected
        : toLowerCase(c.expected, [...__internalAcronyms__, ...SPECIAL_CASES]);

      expect(getPreciseType(c.value, {})).toBe(valueToConvert);
    });
  });
  // }

  // --- Additional tests for nested/wrapped structures ---
  it("correctly handles nested arrays and objects", () => {
    expect(getPreciseType([[]])).toBe("array");
    expect(getPreciseType({ a: { b: 2 } })).toBe("object");
  });
});
