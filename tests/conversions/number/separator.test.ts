import { describe, it, expect } from "vitest";
import { formatNumber } from "@/index";

describe("formatNumber", () => {
  it("should format integers correctly with default separator", () => {
    expect(formatNumber(1000000)).toBe("1,000,000");
    expect(formatNumber("987654321")).toBe("987,654,321");
  });

  it("should format decimals correctly and keep decimal separator", () => {
    expect(formatNumber(1234567.89)).toBe("1,234,567.89");
    expect(formatNumber("1234567.89")).toBe("1,234,567.89");
    expect(formatNumber("1234567,89")).toBe("1,234,567.89");
  });
  it("should format decimals correctly and keep decimal separator and decimal more than 2 digits", () => {
    expect(formatNumber(1234567.892)).toBe("1,234,567.892");
    expect(formatNumber("1234567.892")).toBe("1,234,567.892");
    expect(formatNumber("1234567,892")).toBe("1,234,567.892");
  });

  it("should use custom separator and auto adjust decimal and decimal more than 2 digits", () => {
    expect(formatNumber("1234567.892", ".")).toBe("1.234.567,892");
    expect(formatNumber("1234567,892", ",")).toBe("1,234,567.892");
    expect(formatNumber("987654321", " ")).toBe("987 654 321");
  });
  it("should use custom separator and auto adjust decimal", () => {
    expect(formatNumber("1234567.89", ".")).toBe("1.234.567,89");
    expect(formatNumber("1234567,89", ",")).toBe("1,234,567.89");
    expect(formatNumber("987654321", " ")).toBe("987 654 321");
  });

  it("should flip decimal when separator same as decimal", () => {
    expect(formatNumber("1234.56", ".")).toBe("1.234,56");
    expect(formatNumber("1234,56", ",")).toBe("1,234.56");
  });

  it("should handle input with mixed separators", () => {
    expect(formatNumber("1,234,567.89")).toBe("1,234,567.89");
    expect(formatNumber("1.234.567,89", ",")).toBe("1,234,567.89");
    expect(formatNumber("1.234.567,89", ".")).toBe("1.234.567,89");
    expect(formatNumber("1.234.567,893", ",")).toBe("1,234,567.893");
    expect(formatNumber("1.234.567,893", ".")).toBe("1.234.567,893");
  });

  it("should throw for invalid types", () => {
    expect(() => formatNumber({} as any)).toThrow(TypeError);
    expect(() => formatNumber(1000, 123 as any)).toThrow(TypeError);
  });

  it("should fallback to empty decimal if none present", () => {
    expect(formatNumber("1000000")).toBe("1,000,000");
  });
});
