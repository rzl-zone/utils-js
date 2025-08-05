import { describe, it, expect } from "vitest";
import { replaceAt } from "@/index";

describe("replaceAt", () => {
  it("should replace a single character at index 0", () => {
    expect(replaceAt(0, "hello", "Y")).toBe("Yello");
  });

  it("should replace a character at the middle index", () => {
    expect(replaceAt(2, "abcdef", "X")).toBe("abXdef");
  });

  it("should replace a character at the end of the string", () => {
    expect(replaceAt(4, "hello", "X")).toBe("hellX");
  });

  it("should replace a character with multi-character string", () => {
    expect(replaceAt(2, "hello", "XYZ")).toBe("heXYZlo");
  });

  it("should handle replacement with empty string", () => {
    expect(replaceAt(2, "hello", "")).toBe("helo");
  });

  it("should throw if index is negative", () => {
    expect(() => replaceAt(-1, "hello", "X")).toThrow(
      "Index parameter is out of range at function `replaceAt`"
    );
  });

  it("should throw if index is out of bounds", () => {
    expect(() => replaceAt(5, "hello", "X")).toThrow(
      "Index parameter is out of range at function `replaceAt`"
    );
  });

  it("should throw if index is not a number", () => {
    const anyReplaceAt = replaceAt as any;
    expect(() => anyReplaceAt("1", "hello", "X")).toThrow(
      "Expected 'index' to be a 'number' type, 'replaceTo' and 'originalString' to be a 'string' type"
    );
  });

  it("should throw if originalString is not a string", () => {
    const anyReplaceAt = replaceAt as any;
    expect(() => anyReplaceAt(1, 123, "X")).toThrow(
      "Expected 'index' to be a 'number' type, 'replaceTo' and 'originalString' to be a 'string' type"
    );
  });

  it("should throw if replaceTo is not a string", () => {
    const anyReplaceAt = replaceAt as any;
    expect(() => anyReplaceAt(1, "hello", 123)).toThrow(
      "Expected 'index' to be a 'number' type, 'replaceTo' and 'originalString' to be a 'string' type"
    );
  });
});
