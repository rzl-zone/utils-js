import { describe, it, expect } from "vitest";
import { textContainsAny } from "@/index";

describe("textContainsAny", () => {
  it("should return true if at least one word is found (default options)", () => {
    expect(
      textContainsAny("Hello world, WithAI APP", ["hello", "foo"], {})
    ).toBe(true);
    expect(
      textContainsAny("JavaScript and TypeScript", ["Python", "Script"], {})
    ).toBe(true);
  });

  it("should return false if no words found at all", () => {
    expect(textContainsAny("Machine Learning", ["AI", "Deep"], {})).toBe(false);
    expect(textContainsAny("Hello there", ["world"], {})).toBe(false);
  });

  it("should respect exactMatch option for single words", () => {
    expect(textContainsAny("open-source", ["open"], { exactMatch: true })).toBe(
      false
    );
    expect(textContainsAny("open source", ["open"], { exactMatch: true })).toBe(
      true
    );
    expect(textContainsAny("reusing code", ["use"], { exactMatch: true })).toBe(
      false
    );
  });

  it("should work with custom regex flags", () => {
    expect(textContainsAny("Hello WORLD", ["world"], { flags: "" })).toBe(
      false
    ); // case-sensitive
    expect(textContainsAny("Hello WORLD", ["world"], { flags: "i" })).toBe(
      true
    ); // case-insensitive
  });

  it("should escape special regex characters in searchWords", () => {
    expect(textContainsAny("Price is $15.99", ["$15.99"], {})).toBe(true);
    expect(textContainsAny("RegExp test (a+b)*", ["(a+b)*"], {})).toBe(true);
    expect(textContainsAny("C++ vs Java", ["C++"], {})).toBe(true);
  });

  it("should trim empty strings and ignore them", () => {
    expect(textContainsAny("Hello world", ["", "Hello"], {})).toBe(true);
    expect(textContainsAny("Hello world", ["", ""], {})).toBe(false);
  });

  it("should return false for empty text or non-string text", () => {
    // @ts-expect-error
    expect(textContainsAny(null, ["test"], {})).toBe(false);
    expect(textContainsAny("", ["test"], {})).toBe(false);
    // @ts-expect-error
    expect(textContainsAny(123, ["test"], {})).toBe(false);
  });

  it("should return false if searchWords is not an array or empty", () => {
    // @ts-expect-error
    expect(textContainsAny("Hello", null, {})).toBe(false);
    expect(textContainsAny("Hello", [], {})).toBe(false);
  });

  it("should throw if options is not an object", () => {
    expect(() =>
      // @ts-expect-error
      textContainsAny("Hello", ["Hello"], "invalid")
    ).toThrow("props 'options' must be `object` type!");
  });

  it("should throw if exactMatch is not a boolean", () => {
    expect(() =>
      // @ts-expect-error
      textContainsAny("Hello", ["Hello"], { exactMatch: "yes" })
    ).toThrow("props 'exactMath' must be `boolean` type!");
  });

  it("should throw if flags is not a string", () => {
    expect(() =>
      // @ts-expect-error
      textContainsAny("Hello", ["Hello"], { flags: 123 })
    ).toThrow("props 'flags' must be `string` type!");
  });

  it("should match at least one word among many searchWords", () => {
    expect(
      textContainsAny("TypeScript is great", ["foo", "bar", "Script"], {})
    ).toBe(true);
    expect(
      textContainsAny("TypeScript is great", ["foo", "bar", "baz"], {})
    ).toBe(false);
  });

  it("should handle multiple spaces, tabs, and newlines", () => {
    expect(
      textContainsAny("Hello    world\nNew Line\tTabbed", ["world"], {})
    ).toBe(true);
    expect(textContainsAny("Hello\nNewLine", ["NewLine"], {})).toBe(true);
  });

  it("should return true if partial word found with exactMatch false", () => {
    expect(
      textContainsAny("Javascript", ["Script"], { exactMatch: false })
    ).toBe(true);
  });

  it("should return false if partial word found with exactMatch true", () => {
    expect(
      textContainsAny("Javascript", ["Script"], { exactMatch: true })
    ).toBe(false);
  });

  it("should handle complex punctuation and symbols", () => {
    expect(textContainsAny("Total: 12,000.50 USD!", ["12,000.50"], {})).toBe(
      true
    );
    expect(textContainsAny("Formula: (a+b)^2 = ...", ["(a+b)^2"], {})).toBe(
      true
    );
  });

  it("should work with emoji and unicode characters", () => {
    expect(textContainsAny("Test 😃👍🏽", ["👍🏽"], {})).toBe(true);
    expect(textContainsAny("测试中文", ["中文"], {})).toBe(true);
  });

  it("should match if only one among many special patterns found", () => {
    expect(textContainsAny("x+y = z", ["(x+y)", "(a+b)"], {})).toBe(false);
    expect(textContainsAny("price is $20", ["foo", "$20"], {})).toBe(true);
  });

  it("should work with global & multiline flags for repeated words", () => {
    expect(
      textContainsAny("hello\nhello\nhello", ["hello"], { flags: "gm" })
    ).toBe(true);
  });
});
