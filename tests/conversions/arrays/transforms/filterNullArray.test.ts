import { filterNullArray } from "@/conversions/arrays/index";
import { describe, it, expect } from "vitest";

describe("filterNullArray", () => {
  it("should remove null and undefined in flat array", () => {
    expect(filterNullArray([1, null, 2, undefined, 3])).toEqual([1, 2, 3]);
    expect(filterNullArray(["a", null, "b", undefined, "c"])).toEqual([
      "a",
      "b",
      "c",
    ]);
  });

  it("should return empty array if all elements are null or undefined", () => {
    expect(filterNullArray([null, undefined, null])).toEqual([]);
  });

  it("should return undefined if input is undefined or null", () => {
    expect(filterNullArray(undefined)).toBeUndefined();
    expect(filterNullArray(null)).toBeUndefined();
  });

  it("should return empty array if input is empty", () => {
    expect(filterNullArray([])).toEqual([]);
  });

  it("should handle nested arrays and preserve structure", () => {
    expect(filterNullArray([1, [null, 2, [undefined, 3]]])).toEqual([
      1,
      [2, [3]],
    ]);
    expect(filterNullArray([null, [undefined, [null]]])).toEqual([]);
    expect(
      filterNullArray([
        ["a", null],
        ["b", [undefined, "c"]],
      ])
    ).toEqual([["a"], ["b", ["c"]]]);
  });

  it("should return array as-is if no null or undefined present", () => {
    expect(filterNullArray([1, 2, 3])).toEqual([1, 2, 3]);
    expect(filterNullArray(["x", "y", "z"])).toEqual(["x", "y", "z"]);
  });

  it("should return empty array for non-array input", () => {
    expect(filterNullArray("string" as any)).toEqual([]);
    expect(filterNullArray(123 as any)).toEqual([]);
    expect(filterNullArray({} as any)).toEqual([]);
  });

  it("should handle deeply nested arrays that become empty", () => {
    expect(filterNullArray([[[null, undefined]]])).toEqual([]);
    expect(filterNullArray([[null], [undefined]])).toEqual([]);
  });
});
