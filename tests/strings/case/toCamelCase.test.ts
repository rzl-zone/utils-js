import { toCamelCase } from "@/index";
import { describe, it, expect } from "vitest";

describe("toCamelCase", () => {
  it("should convert simple strings with spaces to camelCase", () => {
    expect(toCamelCase("hello world")).toBe("helloWorld");
    expect(toCamelCase("this is a test")).toBe("thisIsATest");
  });

  it("should handle strings with hyphens and underscores", () => {
    expect(toCamelCase("convert_to-camel case")).toBe("convertToCamelCase");
    expect(toCamelCase("another-test_example")).toBe("anotherTestExample");
  });

  it("should remove unwanted characters", () => {
    expect(toCamelCase("hello@world!#")).toBe("helloWorld");
    expect(toCamelCase("convert%to^camel&case")).toBe("convertToCamelCase");
  });

  it("should return empty string for null or undefined", () => {
    expect(toCamelCase(null)).toBe("");
    expect(toCamelCase(undefined)).toBe("");
  });

  it("should handle empty or whitespace-only strings", () => {
    expect(toCamelCase("")).toBe("");
    expect(toCamelCase("     ")).toBe("");
  });

  it("should keep single word lowercase", () => {
    expect(toCamelCase("single")).toBe("single");
    expect(toCamelCase("WORD")).toBe("word");
  });

  it("should handle mixed case input", () => {
    expect(toCamelCase("HeLLo WoRLd")).toBe("helloWorld");
    expect(toCamelCase("ANother-EXAMPLE_case")).toBe("anotherExampleCase");
  });

  it("should handle multiple consecutive delimiters", () => {
    expect(toCamelCase("hello--world__test")).toBe("helloWorldTest");
    expect(toCamelCase("convert    to    camel")).toBe("convertToCamel");
  });

  it("should handle strings with numbers", () => {
    expect(toCamelCase("test 123 case")).toBe("test123Case");
    expect(toCamelCase("convert_4_times")).toBe("convert4Times");
  });

  it("should handle complex combined input", () => {
    expect(toCamelCase("   ___hello--world__ again!!   ")).toBe(
      "helloWorldAgain"
    );
    expect(toCamelCase("   mix_of-ALL kinds___of Things!!")).toBe(
      "mixOfAllKindsOfThings"
    );
  });

  it("should handle input with mixed symbols and emojis", () => {
    expect(toCamelCase("hello 🌍 world 🚀")).toBe("helloWorld");
    expect(toCamelCase("🔥fire___and--ice❄️")).toBe("fireAndIce");
  });

  it("should handle input with numbers and symbols together", () => {
    expect(toCamelCase("order #123 for user_456")).toBe("order123ForUser456");
    expect(toCamelCase("99 bottles-of_beer!!")).toBe("99BottlesOfBeer");
  });

  it("should handle multiple leading and trailing delimiters", () => {
    expect(toCamelCase("---___   hello-world   ___---")).toBe("helloWorld");
    expect(toCamelCase("///...:::camel-case---___")).toBe("camelCase");
  });

  it("should handle only delimiters as input", () => {
    expect(toCamelCase("____----____")).toBe("");
    expect(toCamelCase("   - _ -   ")).toBe("");
  });

  it("should handle strings with only numbers", () => {
    expect(toCamelCase("123 456 789")).toBe("123456789");
    expect(toCamelCase("12-34_56")).toBe("123456");
  });

  it("should handle crazy mixed input", () => {
    expect(toCamelCase("!!@@##$$%%^^&&**((__++--==~~``||")).toBe("");
    expect(toCamelCase("heLLo---WORLD___Again&&Again")).toBe(
      "helloWorldAgainAgain"
    );
  });

  it("should handle unicode words mixed with ascii", () => {
    expect(toCamelCase("こんにちは world")).toBe("world"); // non a-zA-Z0-9 di-skip
    expect(toCamelCase("добрый день hello")).toBe("hello");
  });
});
