import { describe, it, expect } from "vitest";
import { toNumberArrayUnRecursive } from "@/index";

describe("toNumberArrayUnRecursive", () => {
  it("should convert string numbers to numbers", () => {
    expect(toNumberArrayUnRecursive(["1", "2", "3"])).toEqual([1, 2, 3]);
  });

  it("should convert mix string and numbers", () => {
    expect(toNumberArrayUnRecursive(["4", 5, "6"])).toEqual([4, 5, 6]);
  });

  it("should handle empty array", () => {
    expect(toNumberArrayUnRecursive([])).toEqual([]);
  });

  it("should remove invalid by default", () => {
    expect(
      toNumberArrayUnRecursive(["1", "abc", null, undefined, "7"])
    ).toEqual([1, 7]);
  });

  it("should keep invalid (undefined) if removeInvalidValueNumber is false", () => {
    expect(
      toNumberArrayUnRecursive(["1", "abc", null, undefined, "8"], {
        removeInvalidValueNumber: false,
      })
    ).toEqual([1, undefined, undefined, undefined, 8]);
  });

  it("should parse partial strings as per parseInt", () => {
    expect(toNumberArrayUnRecursive(["12abc", "34def"])).toEqual([12, 34]);
    expect(toNumberArrayUnRecursive(["te1818st", "test1888"])).toEqual([
      1818, 1888,
    ]);
  });

  it("should fail on fully invalid strings", () => {
    expect(toNumberArrayUnRecursive(["abc", ""])).toEqual([]);
  });

  it("should keep undefined for fully invalid if flag is false", () => {
    expect(
      toNumberArrayUnRecursive(["abc", ""], { removeInvalidValueNumber: false })
    ).toEqual([undefined, undefined]);
  });

  it("should handle array of only null and undefined", () => {
    expect(toNumberArrayUnRecursive([null, undefined])).toEqual([]);
    expect(
      toNumberArrayUnRecursive([null, undefined], {
        removeInvalidValueNumber: false,
      })
    ).toEqual([undefined, undefined]);
  });

  it("should return undefined if input is undefined or null", () => {
    expect(toNumberArrayUnRecursive(null)).toBeUndefined();
    expect(toNumberArrayUnRecursive(undefined)).toBeUndefined();
  });

  it("should throw if options is not object or options.removeInvalidValueNumber is not a boolean", () => {
    expect(() =>
      // @ts-expect-error
      toNumberArrayUnRecursive([1, 2], { removeInvalidValueNumber: "false" })
    ).toThrow(TypeError);
    expect(() =>
      // @ts-expect-error
      toNumberArrayUnRecursive([1, 2], { removeInvalidValueNumber: null })
    ).toThrow(TypeError);
    // @ts-expect-error
    expect(() => toNumberArrayUnRecursive(["1", "2"], "bad")).toThrow(
      TypeError
    );
  });
});
