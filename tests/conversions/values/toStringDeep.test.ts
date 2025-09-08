import { describe, it, expect } from "vitest";
import { toStringDeep } from "@/conversions/values/toStringDeep";

describe("toStringDeep - tests", () => {
  it("should return unknown for unknown", () => {
    expect(toStringDeep("" as unknown)).toBe("");
  });
  it("should return empty-string for empty-string", () => {
    expect(toStringDeep("")).toBe("");
  });
  it("should return undefined for null or undefined", () => {
    expect(toStringDeep(null)).toBeUndefined();
    expect(toStringDeep(undefined)).toBeUndefined();
  });

  it("should convert top-level numbers and strings to string", () => {
    expect(toStringDeep(123)).toBe("123");
    expect(toStringDeep("hello")).toBe("hello");
  });

  it("should process arrays of numbers and strings to strings", () => {
    expect(toStringDeep([1, "2", 3])).toEqual(["1", "2", "3"]);
  });

  it("should remove undefined values inside array", () => {
    expect(toStringDeep([1, undefined, "2"])).toEqual(["1", "2"]);
  });

  it("should process deeply nested arrays", () => {
    const input = [1, ["2", [3, [null, "4"]]]];
    expect(toStringDeep(input)).toEqual(["1", ["2", ["3", ["4"]]]]);
  });

  it("should process objects with number/string values", () => {
    const input = { a: 1, b: "2", c: null, d: undefined };
    expect(toStringDeep(input)).toEqual({ a: "1", b: "2" });
  });

  it("should process deeply nested objects", () => {
    const input = {
      x: 1,
      y: {
        z: [2, { w: "3" }, null]
      }
    };
    expect(toStringDeep(input)).toEqual({
      x: "1",
      y: {
        z: ["2", { w: "3" }]
      }
    });
  });

  it("should preserve empty objects and arrays when flags are false", () => {
    const input = { a: {}, b: [] };
    expect(
      toStringDeep(input, { removeEmptyObjects: false, removeEmptyArrays: false })
    ).toEqual({ a: {}, b: [] });
  });

  it("should remove empty arrays but keep empty objects", () => {
    const date = new Date();
    expect(
      toStringDeep(
        {
          inner: {
            a: new RegExp(""),
            b: [Buffer.from(""), 123]
          },
          a: {},
          b: new Set([1]),
          c: new Float32Array(1),
          d: date,
          e: new RegExp("123")
        },
        { removeEmptyObjects: false, removeEmptyArrays: true }
      )
    ).toEqual({
      a: {},
      b: ["1"],
      c: ["0"],
      d: date.toISOString(),
      e: "/123/",
      inner: {
        a: "/(?:)/",
        b: ["123"]
      }
    });
  });

  it("should remove empty objects if removeEmptyObjects=true", () => {
    const input = { a: {}, b: "1" };
    expect(
      toStringDeep(input, { removeEmptyObjects: true, removeEmptyArrays: false })
    ).toEqual({ b: "1" });
  });

  it("should remove empty arrays if removeEmptyArrays=true", () => {
    const input = ["1", [], { a: [] }];
    expect(
      toStringDeep(input, { removeEmptyObjects: false, removeEmptyArrays: true })
    ).toEqual(["1", {}]);
  });

  it("should remove both empty objects and arrays deeply", () => {
    const input = {
      a: {},
      b: [],
      c: [{ d: {}, e: [] }, "1"]
    };
    expect(
      toStringDeep(input, { removeEmptyObjects: true, removeEmptyArrays: true })
    ).toEqual({
      c: ["1"]
    });
  });

  it("should handle mixed nested structure with flags", () => {
    const input = [{ a: {}, b: ["1", [], { c: {} }] }];
    expect(
      toStringDeep(input, { removeEmptyObjects: true, removeEmptyArrays: true })
    ).toEqual([{ b: ["1"] }]);
  });

  it("should remove array if empty after processing when removeEmptyArrays=true", () => {
    expect(
      toStringDeep([null, undefined, {}], {
        removeEmptyObjects: true,
        removeEmptyArrays: true
      })
    ).toBeUndefined();
  });

  it("should remove object if empty after processing when removeEmptyObjects=true", () => {
    expect(
      toStringDeep(
        { a: null, b: undefined },
        { removeEmptyObjects: true, removeEmptyArrays: true }
      )
    ).toEqual({});
  });

  it("should process special types as removed (function, symbol, bigint)", () => {
    const sym = Symbol("sym");
    const fn = () => {};
    const big = BigInt(10);
    const input = ["1", sym, fn, big];
    expect(toStringDeep(input)).toEqual(["1"]);
  });

  it("should throw if flags are not boolean", () => {
    // @ts-expect-error intentional wrong type
    expect(() => toStringDeep([1], "true")).toThrow(TypeError);
    // @ts-expect-error intentional wrong type
    expect(() => toStringDeep([1], false, "false")).toThrow(TypeError);
  });

  it("Mixed", () => {
    expect(
      toStringDeep([null, undefined, {}], {
        removeEmptyObjects: true,
        removeEmptyArrays: true
      })
    ).toEqual(undefined);
  });
});
