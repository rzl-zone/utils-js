import { truncateString } from "@/index";
import { describe, expect, it } from "vitest";

describe("truncateString", () => {
  // --- Test cases for invalid or edge-case inputs ---
  describe("should return an empty string for invalid or insufficient input", () => {
    it('should return "" for null text', () => {
      expect(truncateString(null, 5)).toBe("");
    });

    it('should return "" for undefined text', () => {
      expect(truncateString(undefined, 5)).toBe("");
    });

    it('should return "" for an empty string', () => {
      expect(truncateString("", 5)).toBe("");
    });

    it('should return "" for text consisting only of spaces', () => {
      expect(truncateString("   ", 5)).toBe("");
    });

    it('should return "" when length is 0', () => {
      expect(truncateString("hello world", 0)).toBe("");
    });

    it('should return "" when length is a negative number', () => {
      expect(truncateString("hello world", -5)).toBe("");
    });
  });

  // --- Test cases for default behavior (length=10, ending="...", trim=true) ---
  describe("should handle default parameters correctly", () => {
    it("should not truncate if text length is less than or equal to default length (10)", () => {
      expect(truncateString("short", 10)).toBe("short");
      expect(truncateString("ten chars.", 10)).toBe("ten chars."); // 10 chars
    });

    it("should truncate and append default ending if text is longer than default length", () => {
      expect(truncateString("a very long string", 10)).toBe("a very lon...");
    });

    it("should trim by default when not truncated", () => {
      expect(truncateString("   trimmed   ", 20)).toBe("trimmed");
    });

    it("should trim by default when truncated", () => {
      expect(truncateString("   a very long string   ", 10)).toBe(
        "a very lon..."
      );
    });
  });

  // --- Test cases for custom length ---
  describe("should truncate to specified length", () => {
    it("should truncate correctly with a smaller length", () => {
      expect(truncateString("hello world", 5)).toBe("hello...");
    });

    it("should truncate correctly with a length equal to text length", () => {
      expect(truncateString("exactly", 7)).toBe("exactly");
    });

    it("should truncate correctly with a length greater than text length", () => {
      expect(truncateString("short", 20)).toBe("short");
    });
  });

  // --- Test cases for custom ending ---
  describe("should append custom ending", () => {
    it("should use a custom ending when truncated", () => {
      expect(truncateString("hello world", 5, "---")).toBe("hello---");
    });

    it("should not append ending if not truncated", () => {
      expect(truncateString("short", 10, "---")).toBe("short");
    });

    it("should handle empty string as ending", () => {
      expect(truncateString("hello world", 5, "")).toBe("hello...");
    });
  });

  // --- Test cases for trim option ---
  describe("should handle trim option", () => {
    it("should trim when trim is true (and not truncated)", () => {
      expect(truncateString("   data   ", 15, "...", true)).toBe("data");
    });

    it("should trim when trim is true (and truncated)", () => {
      expect(truncateString("   long data string   ", 8, "...", true)).toBe(
        "long dat..."
      );
    });

    it("should not trim when trim is false (and not truncated)", () => {
      expect(truncateString("   data   ", 15, "...", false)).toBe("   data   ");
    });

    it("should not trim when trim is false (and truncated)", () => {
      expect(truncateString("   long data string   ", 8, "...", false)).toBe(
        "   long..."
      );
    });

    it("should handle mixed leading/trailing spaces with truncation and no trim", () => {
      expect(truncateString(" text with spaces ", 11, "...", false)).toBe(
        " text with..."
      );
    });
  });

  // --- Test cases for combined scenarios ---
  describe("should handle combined scenarios", () => {
    it("should truncate a very long string with specific length and ending", () => {
      expect(
        truncateString(
          "SuperDuperLongStringThatNeedSomeCutting",
          15,
          "---",
          true
        )
      ).toBe("SuperDuperLongS---");
    });

    it("should handle text exactly at truncation point without ending if original trimmed length is not greater", () => {
      // Original: "abc def" (len 7). Truncate to 7. Trimmed original length is 7.
      // Truncated "abc def". No ending.
      expect(truncateString("abc def", 7, "...", true)).toBe("abc def");
    });

    it("should add ending if original trimmed text is longer than length, even if truncated string is same length", () => {
      // Original: "abcde fgh" (len 9). Trimmed: "abcde fgh".
      // Truncate to 7: "abcde f". Result "abcde f..." because original TRIMMED length (9) > length (7)
      expect(truncateString("abcde fgh", 7, "...", true)).toBe("abcde f...");
    });
  });

  // --- Test cases for TypeErrors ---
  describe("should throw TypeError for invalid parameter types", () => {
    it("should throw TypeError if length is not a number", () => {
      // @ts-ignore: Intentionally passing invalid type for testing
      expect(() => truncateString("text", "5")).toThrow(TypeError);
      // @ts-ignore: Intentionally passing invalid type for testing
      expect(() => truncateString("text", "5")).toThrow(
        "Expected 'ending' to be a 'string' type, 'length' to be a 'number' type, 'trim' to be a 'boolean' type"
      );
    });

    it("should throw TypeError if ending is not a string", () => {
      // @ts-ignore: Intentionally passing invalid type for testing
      expect(() => truncateString("text", 5, 123)).toThrow(TypeError);
      // @ts-ignore: Intentionally passing invalid type for testing
      expect(() => truncateString("text", 5, 123)).toThrow(
        "Expected 'ending' to be a 'string' type, 'length' to be a 'number' type, 'trim' to be a 'boolean' type"
      );
    });

    it("should throw TypeError if trim is not a boolean", () => {
      // @ts-ignore: Intentionally passing invalid type for testing
      expect(() => truncateString("text", 5, "...", "true")).toThrow(TypeError);
      // @ts-ignore: Intentionally passing invalid type for testing
      expect(() => truncateString("text", 5, "...", "true")).toThrow(
        "Expected 'ending' to be a 'string' type, 'length' to be a 'number' type, 'trim' to be a 'boolean' type"
      );
    });
  });
});
