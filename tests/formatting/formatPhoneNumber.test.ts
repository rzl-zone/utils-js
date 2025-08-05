import { formatPhoneNumber } from "@/index";
import { describe, it, expect } from "vitest";
// import { describe, it, expect } from "@jest/globals";

describe("formatPhoneNumber", () => {
  it("should format to default phone string", () => {
    expect(formatPhoneNumber("081234567890")).toBe("0812 3456 7890");
  });

  it("should take only numbers", () => {
    expect(
      formatPhoneNumber("(0812) 3456-7890", { takeNumberOnly: true })
    ).toBe("081234567890");
  });

  it("should validate as true for valid phone", () => {
    expect(
      formatPhoneNumber("(0812) 3456-7890", { checkValidOnly: true })
    ).toBe(true);
  });

  it("should validate as true for valid phone", () => {
    expect(formatPhoneNumber("+6281234567890", { checkValidOnly: true })).toBe(
      true
    );
  });
  describe("formatPhoneNumber checkValidOnly", () => {
    it("should accept international format with plus", () => {
      expect(
        formatPhoneNumber("+6281234567890", { checkValidOnly: true })
      ).toBe(true);
      expect(
        formatPhoneNumber("+1 (800) 123-4567", { checkValidOnly: true })
      ).toBe(true);
      expect(
        formatPhoneNumber("+44 20 7946 0958", { checkValidOnly: true })
      ).toBe(true);
    });

    it("should accept local format without plus", () => {
      expect(
        formatPhoneNumber("0812-3456-7890", { checkValidOnly: true })
      ).toBe(true);
      expect(
        formatPhoneNumber("(0812) 3456 7890", { checkValidOnly: true })
      ).toBe(true);
      expect(
        formatPhoneNumber("0812 3456 7890", { checkValidOnly: true })
      ).toBe(true);
    });

    it("should reject string with letters", () => {
      expect(formatPhoneNumber("+62abc123", { checkValidOnly: true })).toBe(
        false
      );
      expect(
        formatPhoneNumber("0812-3456-hello", { checkValidOnly: true })
      ).toBe(false);
    });

    it("should reject if too long", () => {
      expect(
        formatPhoneNumber("+62 123456789012345678901234", {
          checkValidOnly: true,
        })
      ).toBe(false);
    });

    it("should reject multiple plus signs", () => {
      expect(
        formatPhoneNumber("++6281234567890", { checkValidOnly: true })
      ).toBe(false);
    });

    it("should accept slightly unusual separators", () => {
      expect(
        formatPhoneNumber("+62.812.3456.7890", { checkValidOnly: true })
      ).toBe(true);
      expect(
        formatPhoneNumber("+62(812)3456-7890", { checkValidOnly: true })
      ).toBe(true);
    });
  });

  it("should validate as false for invalid phone", () => {
    expect(formatPhoneNumber("invalid@@@", { checkValidOnly: true })).toBe(
      false
    );
  });

  it("should return throws", () => {
    expect(() =>
      formatPhoneNumber("invalid@@@", {
        checkValidOnly: 1,
        // @ts-expect-error
        takeNumberOnly: "",
      })
    ).toThrow(TypeError);

    expect(() =>
      formatPhoneNumber("invalid@@@", {
        // @ts-expect-error
        separator: 1,
      })
    ).toThrow(TypeError);
  });

  it("should allow customization of separator and country format", () => {
    expect(
      formatPhoneNumber("081234567890", {
        separator: "-",
        plusNumberCountry: "+44",
        openingNumberCountry: "(",
        closingNumberCountry: ")",
      })
    ).toBe("(+44) 8123-4567-890");
  });
});
