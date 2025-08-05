import { toKebabCase } from "@/index";
import { describe, it, expect } from "vitest";

describe("toKebabCase", () => {
  it("should convert simple strings with spaces to kebab-case", () => {
    expect(toKebabCase("hello world")).toBe("hello-world");
    expect(toKebabCase("this is a test")).toBe("this-is-a-test");
  });

  it("should handle strings with hyphens and underscores", () => {
    expect(toKebabCase("convert_to-kebab case")).toBe("convert-to-kebab-case");
    expect(toKebabCase("another-test_example")).toBe("another-test-example");
  });

  it("should remove unwanted characters and treat them as delimiters", () => {
    expect(toKebabCase("hello@world!#")).toBe("hello-world");
    expect(toKebabCase("convert%to^kebab&case")).toBe("convert-to-kebab-case");
  });

  it("should return empty string for null or undefined", () => {
    expect(toKebabCase(null)).toBe("");
    expect(toKebabCase(undefined)).toBe("");
  });

  it("should handle empty or whitespace-only strings", () => {
    expect(toKebabCase("")).toBe("");
    expect(toKebabCase("     ")).toBe("");
  });

  it("should handle single word input", () => {
    expect(toKebabCase("single")).toBe("single");
    expect(toKebabCase("WORD")).toBe("word");
  });

  it("should handle mixed case input", () => {
    expect(toKebabCase("HeLLo WoRLd")).toBe("hello-world");
    expect(toKebabCase("ANother-EXAMPLE_case")).toBe("another-example-case");
  });

  it("should handle multiple consecutive delimiters", () => {
    expect(toKebabCase("hello--world__test")).toBe("hello-world-test");
    expect(toKebabCase("convert    to    kebab")).toBe("convert-to-kebab");
  });

  it("should handle strings with numbers", () => {
    expect(toKebabCase("test 123 case")).toBe("test-123-case");
    expect(toKebabCase("convert_4_times")).toBe("convert-4-times");
  });

  it("should handle complex combined input", () => {
    expect(toKebabCase("   ___hello--world__ again!!   ")).toBe(
      "hello-world-again"
    );
    expect(toKebabCase("   mix_of-ALL kinds___of Things!!")).toBe(
      "mix-of-all-kinds-of-things"
    );
  });

  it("should handle input with mixed symbols and emojis", () => {
    expect(toKebabCase("hello 🌍 world 🚀")).toBe("hello-world");
    expect(toKebabCase("🔥fire___and--ice❄️")).toBe("fire-and-ice");
  });

  it("should handle input with numbers and symbols together", () => {
    expect(toKebabCase("order #123 for user_456")).toBe(
      "order-123-for-user-456"
    );
    expect(toKebabCase("99 bottles-of_beer!!")).toBe("99-bottles-of-beer");
  });

  it("should handle multiple leading and trailing delimiters", () => {
    expect(toKebabCase("---___   hello-world   ___---")).toBe("hello-world");
    expect(toKebabCase("///...:::kebab-case---___")).toBe("kebab-case");
  });

  it("should handle only delimiters as input", () => {
    expect(toKebabCase("____----____")).toBe("");
    expect(toKebabCase("   - _ -   ")).toBe("");
  });

  it("should handle strings with only numbers", () => {
    expect(toKebabCase("123 456 789")).toBe("123-456-789");
    expect(toKebabCase("12-34_56")).toBe("12-34-56");
  });

  it("should handle crazy mixed input", () => {
    expect(toKebabCase("!!@@##$$%%^^&&**((__++--==~~``||")).toBe("");
    expect(toKebabCase("heLLo---WORLD___Again&&Again")).toBe(
      "hello-world-again-again"
    );
  });

  it("should handle unicode words mixed with ascii", () => {
    expect(toKebabCase("こんにちは world")).toBe("world");
    expect(toKebabCase("добрый день hello")).toBe("hello");
  });
});
