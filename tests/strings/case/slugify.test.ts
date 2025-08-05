import { describe, it, expect } from "vitest";
import { slugify } from "@/index";

describe("slugify", () => {
  it("should handle simple sentence", () => {
    expect(slugify("hello world")).toBe("hello-world");
    expect(slugify("This is A Test")).toBe("this-is-a-test");
  });

  it("should collapse multiple spaces", () => {
    expect(slugify("   hello    world   again  ")).toBe("hello-world-again");
  });

  it("should remove special characters and symbols", () => {
    expect(slugify("hello@world!# ok$%")).toBe("hello-world-ok");
    expect(slugify("100% guaranteed *awesome*")).toBe("100-guaranteed-awesome");
  });

  it("should handle mixed hyphens and underscores", () => {
    expect(slugify("hello_world---again")).toBe("hello-world-again");
    expect(slugify("__this--is__CRAZY")).toBe("this-is-crazy");
  });

  it("should handle emojis and keep only words", () => {
    expect(slugify("🔥 fire world 🌍")).toBe("fire-world");
    expect(slugify("🚀 rocket to the moon 🌕")).toBe("rocket-to-the-moon");
  });

  it("should handle numbers inside text", () => {
    expect(slugify("order 123 for user 456")).toBe("order-123-for-user-456");
    expect(slugify("9 lives of a cat")).toBe("9-lives-of-a-cat");
  });

  it("should produce empty for only symbols", () => {
    expect(slugify("$$$###!!!")).toBe("");
    expect(slugify("___---")).toBe("");
  });

  it("should handle extreme complex input", () => {
    const input = "  ___hello__--WORLD!! 🚀 🚀 🔥🔥     go--crazy_123__  ";
    expect(slugify(input)).toBe("hello-world-go-crazy-123");
  });

  it("should handle unicode non-latin by dropping them", () => {
    expect(slugify("こんにちは 世界")).toBe("");
    expect(slugify("добрый день world")).toBe("world");
  });
});
