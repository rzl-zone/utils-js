import { describe, it, expect } from "vitest";
import { toSnakeCase } from "@/index";

describe("toSnakeCase", () => {
  it("should convert spaces to underscores", () => {
    expect(toSnakeCase("hello world")).toBe("hello_world");
    expect(toSnakeCase("This is A Test")).toBe("this_is_a_test");
  });

  it("should collapse multiple spaces", () => {
    expect(toSnakeCase("   hello    world   again  ")).toBe(
      "hello_world_again"
    );
  });

  it("should remove weird characters", () => {
    expect(toSnakeCase("hello@world!# ok$%")).toBe("hello_world_ok");
  });

  it("should process hyphens and underscores mixed", () => {
    expect(toSnakeCase("hello_world---again")).toBe("hello_world_again");
    expect(toSnakeCase("__this--is__SNAKE")).toBe("this_is_snake");
  });

  it("should keep numbers in place", () => {
    expect(toSnakeCase("order 123 item 456")).toBe("order_123_item_456");
    expect(toSnakeCase("9 lives of a cat")).toBe("9_lives_of_a_cat");
  });

  it("should ignore emojis and symbols", () => {
    expect(toSnakeCase("hello 🌍 world 🚀")).toBe("hello_world");
    expect(toSnakeCase("🔥 fire and ice ❄️")).toBe("fire_and_ice");
  });

  it("should handle ultra dirty input", () => {
    const input = " 🚀 __hello--WORLD 😅 123 --_ test   ";
    expect(toSnakeCase(input)).toBe("hello_world_123_test");
  });

  it("should drop non-latin chars", () => {
    expect(toSnakeCase("こんにちは 世界")).toBe("");
    expect(toSnakeCase("добрый день")).toBe("");
  });

  it("should be empty for only symbols", () => {
    expect(toSnakeCase("___---$$$")).toBe("");
  });
});
