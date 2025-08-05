import { toPascalCase } from "@/index";
import { describe, it, expect } from "vitest";

describe("toPascalCase", () => {
  it("should convert simple strings with spaces to PascalCase", () => {
    expect(toPascalCase("hello world")).toBe("HelloWorld");
    expect(toPascalCase("this is a test")).toBe("ThisIsATest");
  });

  it("should handle strings with hyphens and underscores", () => {
    expect(toPascalCase("convert_to-pascal case")).toBe("ConvertToPascalCase");
    expect(toPascalCase("another-test_example")).toBe("AnotherTestExample");
  });

  it("should remove unwanted characters", () => {
    expect(toPascalCase("hello@world!#")).toBe("HelloWorld");
    expect(toPascalCase("convert%to^pascal&case")).toBe("ConvertToPascalCase");
  });

  it("should return empty string for null or undefined", () => {
    expect(toPascalCase(null)).toBe("");
    expect(toPascalCase(undefined)).toBe("");
  });

  it("should handle empty or whitespace-only strings", () => {
    expect(toPascalCase("")).toBe("");
    expect(toPascalCase("     ")).toBe("");
  });

  it("should capitalize single word", () => {
    expect(toPascalCase("single")).toBe("Single");
    expect(toPascalCase("WORD")).toBe("Word");
  });

  it("should handle mixed case input", () => {
    expect(toPascalCase("HeLLo WoRLd")).toBe("HelloWorld");
    expect(toPascalCase("ANother-EXAMPLE_case")).toBe("AnotherExampleCase");
  });

  it("should handle multiple consecutive delimiters", () => {
    expect(toPascalCase("hello--world__test")).toBe("HelloWorldTest");
    expect(toPascalCase("convert    to    pascal")).toBe("ConvertToPascal");
  });

  it("should handle strings with numbers", () => {
    expect(toPascalCase("test 123 case")).toBe("Test123Case");
    expect(toPascalCase("convert_4_times")).toBe("Convert4Times");
  });

  it("should handle complex combined input", () => {
    expect(toPascalCase("   ___hello--world__ again!!   ")).toBe(
      "HelloWorldAgain"
    );
    expect(toPascalCase("   mix_of-ALL kinds___of Things!!")).toBe(
      "MixOfAllKindsOfThings"
    );
  });

  it("should handle input with mixed symbols and emojis", () => {
    expect(toPascalCase("hello 🌍 world 🚀")).toBe("HelloWorld");
    expect(toPascalCase("🔥fire___and--ice❄️")).toBe("FireAndIce");
  });

  it("should handle input with numbers and symbols together", () => {
    expect(toPascalCase("order #123 for user_456")).toBe("Order123ForUser456");
    expect(toPascalCase("99 bottles-of_beer!!")).toBe("99BottlesOfBeer");
  });

  it("should handle multiple leading and trailing delimiters", () => {
    expect(toPascalCase("---___   hello-world   ___---")).toBe("HelloWorld");
    expect(toPascalCase("///...:::pascal-case---___")).toBe("PascalCase");
  });

  it("should handle only delimiters as input", () => {
    expect(toPascalCase("____----____")).toBe("");
    expect(toPascalCase("   - _ -   ")).toBe("");
  });

  it("should handle strings with only numbers", () => {
    expect(toPascalCase("123 456 789")).toBe("123456789");
    expect(toPascalCase("12-34_56")).toBe("123456");
  });

  it("should handle crazy mixed input", () => {
    expect(toPascalCase("!!@@##$$%%^^&&**((__++--==~~``||")).toBe("");
    expect(toPascalCase("heLLo---WORLD___Again&&Again")).toBe(
      "HelloWorldAgainAgain"
    );
  });

  it("should handle unicode words mixed with ascii", () => {
    expect(toPascalCase("こんにちは world")).toBe("World");
    expect(toPascalCase("добрый день hello")).toBe("Hello");
  });

  it("should handle repeated emojis as delimiters", () => {
    expect(toPascalCase("hello🌟🌟world🌟🌟again")).toBe("HelloWorldAgain");
    expect(toPascalCase("🚀launch___the---rocket🚀")).toBe("LaunchTheRocket");
  });

  it("should handle mix of digits, symbols, and spaces", () => {
    expect(toPascalCase(" 99 bottles--of_beer!! on_the_wall")).toBe(
      "99BottlesOfBeerOnTheWall"
    );
    expect(toPascalCase("load_data-4-2023__test")).toBe("LoadData42023Test");
  });

  it("should handle very long strings with many delimiters", () => {
    const longInput =
      "___this--is__a--very___long---string__with--many___delimiters____in___between___";
    expect(toPascalCase(longInput)).toBe(
      "ThisIsAVeryLongStringWithManyDelimitersInBetween"
    );
  });

  it("should handle symbols in between digits and words", () => {
    expect(toPascalCase("ver$ion_2.0.1-beta")).toBe("VerIon201Beta");
    expect(toPascalCase("temp#42&deg")).toBe("Temp42Deg");
  });

  it("should handle complex mixed unicode + ascii + symbols", () => {
    expect(toPascalCase("привет---hello___世界")).toBe("Hello");
    expect(toPascalCase("🌸🌸日本-hello-world🌸🌸")).toBe("HelloWorld");
  });

  it("should handle crazy nested symbols mixed with words", () => {
    expect(toPascalCase("___he##llo---wo!!rld&&&&again__123___")).toBe(
      "HeLloWoRldAgain123"
    );
  });

  it("should handle string with only emojis", () => {
    expect(toPascalCase("🎉🎉🎉🎉")).toBe("");
    expect(toPascalCase("🚀🔥❄️")).toBe("");
  });

  it("should handle camel-ish input and reformat to Pascal", () => {
    expect(toPascalCase("camelCaseExample")).toBe("Camelcaseexample");
    expect(toPascalCase("PascalCaseInput")).toBe("Pascalcaseinput");
  });
});
