import { describe, it, expect } from "vitest";
import { assertIsPlainObject } from "@/assertions/objects/assertIsPlainObject";
import { type OptionsMessageFunctionAssertIs } from "@/assertions/_private/assertIs";

describe("assertIsPlainObject", () => {
  it("does not throw for plain objects", () => {
    expect(() => assertIsPlainObject({})).not.toThrow();
    expect(() => assertIsPlainObject({ a: 1, b: {} })).not.toThrow();
    expect(() => assertIsPlainObject(Object.create(null))).not.toThrow();
  });

  it("throws for non-plain objects", () => {
    const values = [
      [], // array
      42,
      "string",
      null,
      undefined,
      () => {},
      new Date(),
      new Map()
    ];

    for (const val of values) {
      expect(() => assertIsPlainObject(val as any)).toThrow(TypeError);
    }
  });

  it("throws with default error message", () => {
    try {
      assertIsPlainObject(123);
    } catch (err: any) {
      expect(err.message).toMatch(/must be of type `plain-object`/);
    }
  });

  it("throws with custom string message", () => {
    const customMsg = "Custom error!";
    expect(() => assertIsPlainObject(123, { message: customMsg })).toThrow(customMsg);
  });

  it("throws with custom function message", () => {
    const fnMsg = (type: OptionsMessageFunctionAssertIs) =>
      `Expected ${type.validType}, got ${type.currentType}`;
    expect(() => assertIsPlainObject(123, { message: fnMsg })).toThrow(
      "Expected plain-object, got number"
    );
  });

  it("narrows type after assertion", () => {
    const obj: unknown = { foo: "bar" };
    assertIsPlainObject(obj);
    // after this line, TypeScript knows obj is a plain object
    expect(obj.foo).toBe("bar");
  });
});
