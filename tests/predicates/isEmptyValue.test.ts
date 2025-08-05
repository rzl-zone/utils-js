import { isEmptyValue } from "@/index";
import { describe, it, expect } from "vitest";

describe("isEmptyValue", () => {
  it("should return true for null, undefined, false, NaN", () => {
    expect(isEmptyValue(null)).toBe(true);
    expect(isEmptyValue(undefined)).toBe(true);
    expect(isEmptyValue(false)).toBe(true);
    expect(isEmptyValue(NaN)).toBe(true);
  });

  it("should return true for empty strings and strings with only whitespace", () => {
    expect(isEmptyValue("")).toBe(true);
    expect(isEmptyValue("   ")).toBe(true);
    expect(isEmptyValue("\n\t")).toBe(true);
  });

  it("should return false for non-empty strings", () => {
    expect(isEmptyValue("hello")).toBe(false);
    expect(isEmptyValue("  hi  ")).toBe(false);
  });

  it("should return true for empty arrays", () => {
    expect(isEmptyValue([])).toBe(true);
  });

  it("should return false for non-empty arrays", () => {
    expect(isEmptyValue([1, 2, 3])).toBe(false);
    expect(isEmptyValue([""])).toBe(false);
  });

  it("should return true for empty objects", () => {
    expect(isEmptyValue({})).toBe(true);
  });

  it("should return false for objects with keys", () => {
    expect(isEmptyValue({ a: 1 })).toBe(false);
    expect(isEmptyValue({ length: 0 })).toBe(false);
  });

  it("should return false for objects with symbols", () => {
    const sym = Symbol("x");
    const obj = { [sym]: 123 };
    expect(isEmptyValue(obj)).toBe(false);
  });

  it("should return false for numbers except 0", () => {
    expect(isEmptyValue(0)).toBe(false); // 0 is falsy so true
    expect(isEmptyValue(42)).toBe(false);
    expect(isEmptyValue(-1)).toBe(false);
  });

  it("should return false for functions", () => {
    expect(isEmptyValue(() => {})).toBe(false);
  });
});

describe("isEmptyValue test 2", () => {
  it("should return true for empty objects", () => {
    expect(isEmptyValue({})).toBe(true);
  });

  it("should return true for empty arrays", () => {
    expect(isEmptyValue([])).toBe(true);
  });

  it("should return false for objects with properties", () => {
    expect(isEmptyValue({ key: "value" })).toBe(false);
    expect(isEmptyValue({ a: 1 })).toBe(false);
  });

  it("should return false for non-empty arrays", () => {
    expect(isEmptyValue([1, 2, 3])).toBe(false);
  });

  it("should return true for null and undefined", () => {
    expect(isEmptyValue(null)).toBe(true);
    expect(isEmptyValue(undefined)).toBe(true);
  });

  it("should return true for empty strings or strings with only spaces", () => {
    expect(isEmptyValue("")).toBe(true);
    expect(isEmptyValue("   ")).toBe(true);
  });

  it("should return false for non-empty strings", () => {
    expect(isEmptyValue("hello")).toBe(false);
    expect(isEmptyValue("  text ")).toBe(false);
  });

  it("should return true for NaN", () => {
    expect(isEmptyValue(NaN)).toBe(true);
  });

  it("should return true for false", () => {
    expect(isEmptyValue(false)).toBe(true);
  });

  it("should return false for 0", () => {
    expect(isEmptyValue(0)).toBe(false);
  });

  it("should return false for functions", () => {
    expect(isEmptyValue(() => {})).toBe(false);
    expect(isEmptyValue(function () {})).toBe(false);
  });

  it("should handle objects with symbol properties", () => {
    const sym = Symbol("test");
    const objWithSym = { [sym]: 123 };
    expect(isEmptyValue(objWithSym)).toBe(false);

    const emptySymObj = Object.create(null);
    Object.defineProperty(emptySymObj, Symbol("foo"), {
      enumerable: false,
      value: 42,
    });
    expect(isEmptyValue(emptySymObj)).toBe(false);
  });
});
