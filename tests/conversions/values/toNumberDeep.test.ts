import { describe, it, expect } from "vitest";
import { toNumberDeep } from "@/index";

describe("toNumberDeep - additional tests", () => {
  it("should handle top-level null or undefined", () => {
    expect(toNumberDeep(null)).toBeUndefined();
    expect(toNumberDeep(undefined)).toBeUndefined();
  });

  it("should handle top-level numbers and numeric strings", () => {
    expect(toNumberDeep("123")).toBe(123);
    expect(toNumberDeep(456)).toBe(456);
    expect(toNumberDeep("12.34")).toBe(12.34);
    expect(toNumberDeep("not number")).toBeUndefined();
  });

  it("should remove NaN and Infinity even at top level array", () => {
    expect(toNumberDeep([NaN, Infinity, -Infinity, "10"])).toEqual([10]);
  });

  it("should preserve empty objects and arrays when flags are false", () => {
    expect(toNumberDeep({ a: {}, b: [] }, false, false)).toEqual({
      a: {},
      b: [],
    });
    expect(toNumberDeep(["1", { a: {} }], false)).toEqual([1, { a: {} }]);
    expect(toNumberDeep(["1", [], { a: [] }], false, false)).toEqual([
      1,
      [],
      { a: [] },
    ]);
  });

  it("should remove empty objects but keep empty object", () => {
    expect(toNumberDeep(["1", { a: {} }], true)).toEqual([1]);
  });
  it("should remove empty objects but keep empty arrays", () => {
    expect(toNumberDeep({ a: {}, b: [] }, true, false)).toEqual({
      b: [],
    });
  });

  it("should remove empty arrays but keep empty objects", () => {
    expect(toNumberDeep({ a: {}, b: [] }, false, true)).toEqual({
      a: {},
    });
  });

  it("should fully clean deeply empty structures with both flags", () => {
    expect(
      toNumberDeep(
        { a: {}, b: [null, undefined, {}], c: { d: [] } },
        true,
        true
      )
    ).toEqual({});
  });

  it("should process deeply nested object mixed with valid and invalid numbers", () => {
    const input = {
      a: "1",
      b: {
        c: "not num",
        d: ["2", "3.5", null, { e: "4.4", f: "invalid" }],
      },
      g: [],
    };
    expect(toNumberDeep(input)).toEqual({
      a: 1,
      b: {
        d: [2, 3.5, { e: 4.4 }],
      },
      g: [],
    });
  });

  it("should respect both removeEmptyObjects and removeEmptyArrays deeply", () => {
    const input = {
      x: {},
      y: [],
      z: [{ a: {}, b: [] }],
    };
    expect(toNumberDeep(input, false, true)).toEqual({
      x: {},
      z: [{ a: {} }],
    });
  });

  it("should respect removeEmptyObjects true and removeEmptyArrays false deeply", () => {
    const input = {
      x: {},
      y: [],
      z: [{ a: {}, b: [] }],
    };
    expect(toNumberDeep(input, true, false)).toEqual({
      y: [],
      z: [{ b: [] }],
    });
  });

  it("should respect both removeEmptyObjects and removeEmptyArrays as true deeply", () => {
    const input = toNumberDeep(
      {
        x: {},
        y: [],
        z: [{ a: {}, b: [], c: "3" }, { d: "4.5" }],
      },
      true,
      true
    );
    expect(input).toEqual({ z: [{ c: 3 }, { d: 4.5 }] });
    expect(
      toNumberDeep([[[[[["1"]]], null]], "2", "abc"], false, true)
    ).toEqual([[[[[[1]]]]], 2]);
  });

  it("should handle array with nested empty containers and remove appropriately", () => {
    const input = ["1", {}, [], ["2", {}, []]];
    expect(toNumberDeep(input, true, true)).toEqual([1, [2]]);
  });

  it("should process weird types inside array like functions or symbols as removed", () => {
    const sym = Symbol("wow");
    const arr = ["1", () => {}, sym, "2"];
    expect(toNumberDeep(arr)).toEqual([1, 2]);
  });

  it("should keep nested empty object if parent removal not requested", () => {
    expect(toNumberDeep({ a: { b: {} } }, false, true)).toEqual({
      a: { b: {} },
    });
  });

  it("should clean nested object if removeEmptyObjects=true even inside array", () => {
    const input = ["1", { a: {} }];
    expect(toNumberDeep(input, true)).toEqual([1]);
  });

  it("should still keep empty objects if removeEmptyObjects=false", () => {
    const input = ["1", { a: {} }];
    expect(toNumberDeep(input, false)).toEqual([1, { a: {} }]);
  });

  it("should still keep empty arrays if removeEmptyArrays=false", () => {
    const input = ["1", [], { a: [] }];
    expect(toNumberDeep(input, false, false)).toEqual([1, [], { a: [] }]);
  });
});
