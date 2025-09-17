import { describe, it, expect } from "vitest";
import { assertIsArray } from "@/assertions/objects/assertIsArray";

describe("assertIsArray", () => {
  it("should not throw for a valid array", () => {
    expect(() => assertIsArray([1, 2, 3])).not.toThrow();
    const arr: unknown = [1, 2];
    assertIsArray(arr);
    // after assertion, arr is number[]
    expect(Array.isArray(arr)).toBe(true);
  });

  it("should throw TypeError with default message for non-array", () => {
    expect(() => assertIsArray(123)).toThrowError(
      /Parameter input \(`value`\) must be of type `array`, but received: `number`\./
    );
  });

  it("should throw with custom string message", () => {
    expect(() => assertIsArray("hello", { message: "Must be an array!" })).toThrowError(
      "Must be an array!"
    );
  });

  it("should throw with custom function message", () => {
    expect(() =>
      assertIsArray(42, {
        message: (type) => `Expected ${type.validType} but got ${type.currentType}`
      })
    ).toThrowError("Expected array but got number");
  });

  it("should throw with custom function + formatCase", () => {
    expect(() =>
      assertIsArray(123n, {
        message: (type) => `Expected ${type.validType} but got (${type.currentType}).`,
        formatCase: "toKebabCase"
      })
    ).toThrowError("Expected array but got (big-int).");
  });

  it("should work with union narrowing", () => {
    const mixed: string | number[] | undefined = [1, 2];
    assertIsArray(mixed);
    // TS should know it's number[] now
    expect(mixed.every((x) => typeof x === "number")).toBe(true);
  });
});
