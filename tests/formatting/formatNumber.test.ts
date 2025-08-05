import { describe, it, expect } from "vitest";
import { formatNumber } from "@/index";

describe("formatNumber", () => {
  it("should format numbers with default separator ','", () => {
    expect(formatNumber(1000000)).toBe("1,000,000");
    expect(formatNumber("987654321")).toBe("987,654,321");
    expect(formatNumber(1234567.89)).toBe("1,234,567.89");
  });

  it("should normalize input with commas and dots", () => {
    expect(formatNumber("1234567,89")).toBe("1,234,567.89");
    expect(formatNumber("1234567.892")).toBe("1,234,567.892");
    expect(formatNumber("1,234,567.89")).toBe("1,234,567.89");
    expect(formatNumber("1.234.567,89", ",")).toBe("1,234,567.89");
  });

  it("should handle custom separator '.' and flip decimal separator to ','", () => {
    expect(formatNumber("1234567.89", ".")).toBe("1.234.567,89");
    expect(formatNumber("1.234.567,893", ".")).toBe("1.234.567,893");
    expect(formatNumber("1234.56", ".")).toBe("1.234,56");
  });

  it("should handle custom separator ',' and flip decimal separator to '.'", () => {
    expect(formatNumber("1234567,89", ",")).toBe("1,234,567.89");
    expect(formatNumber("1234,56", ",")).toBe("1,234.56");
  });

  it("should support space as thousands separator", () => {
    expect(formatNumber("987654321", " ")).toBe("987 654 321");
  });

  it("should preserve decimals with more than 2 digits", () => {
    expect(formatNumber("1234567.892")).toBe("1,234,567.892");
  });

  it("should throw TypeError if value is not string or number", () => {
    // @ts-expect-error test wrong type
    expect(() => formatNumber(null)).toThrow(TypeError);
    // @ts-expect-error test wrong type
    expect(() => formatNumber(undefined)).toThrow(TypeError);
    // @ts-expect-error test wrong type
    expect(() => formatNumber({})).toThrow(TypeError);
  });

  it("should throw TypeError if separator is not string", () => {
    // @ts-expect-error test wrong type
    expect(() => formatNumber("1234", 5)).toThrow(TypeError);
    // @ts-expect-error test wrong type
    expect(() => formatNumber("1234", null)).toThrow(TypeError);
  });

  it("should handle numbers without decimals correctly", () => {
    expect(formatNumber("123456789")).toBe("123,456,789");
    expect(formatNumber(987654321)).toBe("987,654,321");
  });

  it("should handle values with multiple decimal separators", () => {
    expect(formatNumber("1,234,567.89")).toBe("1,234,567.89");
    expect(formatNumber("1.234.567,89", ",")).toBe("1,234,567.89");
  });
});
