import { describe, it, expect } from "vitest";
import { toStringArrayUnRecursive } from "@/index";

describe("toStringArrayUnRecursive", () => {
  it("should convert numbers and strings to strings", () => {
    expect(toStringArrayUnRecursive([1, "2", 3])).toEqual(["1", "2", "3"]);
  });

  it("should handle empty array", () => {
    expect(toStringArrayUnRecursive([])).toEqual([]);
  });

  it("should remove null and undefined by default", () => {
    expect(toStringArrayUnRecursive([1, null, undefined, "abc"])).toEqual([
      "1",
      "abc",
    ]);
  });

  it("should keep null and undefined if removeInvalidValue is false", () => {
    expect(
      toStringArrayUnRecursive([1, null, undefined, "abc"], {
        removeInvalidValue: false,
      })
    ).toEqual(["1", null, undefined, "abc"]);
  });

  it("should handle array of only null and undefined", () => {
    expect(toStringArrayUnRecursive([null, undefined])).toEqual([]);
    expect(
      toStringArrayUnRecursive([null, undefined], { removeInvalidValue: false })
    ).toEqual([null, undefined]);
  });

  it("should handle strings with spaces or empty string", () => {
    expect(toStringArrayUnRecursive([" ", ""])).toEqual([" ", ""]);
  });

  it("should return undefined if input is undefined or null", () => {
    expect(toStringArrayUnRecursive(null)).toBeUndefined();
    expect(toStringArrayUnRecursive(undefined)).toBeUndefined();
  });

  it("should throw if options is not object or options.removeInvalidValue is not a boolean", () => {
    expect(() =>
      // @ts-expect-error
      toStringArrayUnRecursive([1, 2], { removeInvalidValue: "false" })
    ).toThrow(TypeError);
    expect(() =>
      // @ts-expect-error
      toStringArrayUnRecursive([1, 2], { removeInvalidValue: null })
    ).toThrow(TypeError);
    // @ts-expect-error
    expect(() => toStringArrayUnRecursive([1, 2], "bad")).toThrow(TypeError);
  });
});
