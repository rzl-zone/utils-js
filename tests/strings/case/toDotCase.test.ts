import { describe, it, expect } from "vitest";
import { toDotCase } from "@/index";

describe("toDotCase", () => {
  it("should join words with dots", () => {
    expect(toDotCase("hello world")).toBe("hello.world");
    expect(toDotCase("This is A Test")).toBe("this.is.a.test");
  });

  it("should collapse multiple spaces", () => {
    expect(toDotCase("   hello    world   again  ")).toBe("hello.world.again");
  });

  it("should remove special characters", () => {
    expect(toDotCase("hello@world!# ok$%")).toBe("hello.world.ok");
  });

  it("should handle underscores and hyphens", () => {
    expect(toDotCase("hello_world---again")).toBe("hello.world.again");
  });

  it("should process numbers mixed in words", () => {
    expect(toDotCase("file 123 name")).toBe("file.123.name");
    expect(toDotCase("9 lives of a cat")).toBe("9.lives.of.a.cat");
  });

  it("should deal with emojis and weird unicode", () => {
    expect(toDotCase("hello 🌍 world 🚀")).toBe("hello.world");
    expect(toDotCase("🔥 fire_and_ice ❄️")).toBe("fire.and.ice");
  });

  it("should collapse repeated delimiters", () => {
    expect(toDotCase("___this---is___DOT___case")).toBe("this.is.dot.case");
  });

  it("should produce empty string for symbols only", () => {
    expect(toDotCase("$$$###!!!")).toBe("");
  });

  it("should handle completely non-latin dropping them", () => {
    expect(toDotCase("こんにちは 世界")).toBe("");
    expect(toDotCase("добрый день")).toBe("");
  });

  it("should handle extreme mixed", () => {
    const input = " 🚀  -- hello__WORLD 😅 123 ---ok";
    expect(toDotCase(input)).toBe("hello.world.123.ok");
  });
});
