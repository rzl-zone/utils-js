import { describe, it, expect } from "vitest";
import { assertIsBigInt } from "@/assertions/number/assertIsBigInt";

describe("assertIsBigInt", () => {
  it("should pass when value is bigint", () => {
    expect(() => assertIsBigInt(123n)).not.toThrow();
    const value: unknown = 999n;
    assertIsBigInt(value);
    // after assertion, TS knows value is bigint
    const result: bigint = value;
    expect(result).toBe(999n);
  });

  it("should throw when value is not bigint", () => {
    expect(() => assertIsBigInt(42)).toThrow(TypeError);
    expect(() => assertIsBigInt("123")).toThrow(TypeError);
    expect(() => assertIsBigInt(null)).toThrow(TypeError);
    expect(() => assertIsBigInt(undefined)).toThrow(TypeError);
    expect(() => assertIsBigInt({})).toThrow(TypeError);
  });

  it("should use custom string error message", () => {
    expect(() => assertIsBigInt(42, { message: "Must be a bigint!" })).toThrowError(
      "Must be a bigint!"
    );
  });

  it("should use custom function error message", () => {
    expect(() =>
      assertIsBigInt(42, {
        message: (type) => `Expected ${type.validType} but got (${type.currentType}).`
      })
    ).toThrowError(/Expected big-int but got \(number\)/);
  });

  it("should respect formatCase option", () => {
    expect(() =>
      assertIsBigInt(42, {
        message: (type) => `Expected ${type.validType} but got (${type.currentType}).`,
        formatCase: "toKebabCase"
      })
    ).toThrowError("Expected big-int but got (number).");
  });
});
