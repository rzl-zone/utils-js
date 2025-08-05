import { describe, it, expect } from "vitest";
import { omitProps } from "@/index";

describe("omitProps", () => {
  it("should omit a single key", () => {
    const result = omitProps({ a: 1, b: 2 }, ["a"]);
    expect(result).toEqual({ b: 2 });
  });

  it("should omit multiple keys", () => {
    const result = omitProps({ a: 1, b: 2, c: 3 }, ["b", "c"]);
    expect(result).toEqual({ a: 1 });
  });

  it("should return the same object if arrayExcept is empty", () => {
    const obj = { x: 5, y: 6 };
    expect(omitProps(obj, [])).toEqual(obj);
  });

  it("should omit nothing if arrayExcept contains non-existent keys", () => {
    const obj = { a: 1, b: 2 };

    // @ts-expect-error Invalid seconds params (non-existent key).
    const result = omitProps(obj, ["x", "y"]);
    expect(result).toEqual(obj);
  });

  it("should throw error on duplicate keys in arrayExcept", () => {
    expect(() => omitProps({ a: 1, b: 2 }, ["a", "a"])).toThrow(
      "Function omitProps Error, cause Duplicate of arrayExcept: a"
    );
  });

  it("should handle an empty object", () => {
    // @ts-expect-error technically valid, but no keys to omit
    expect(omitProps({}, ["a"])).toEqual({});
  });

  it("should not mutate the original object", () => {
    const obj = { a: 1, b: 2 };
    const copy = { ...obj };
    omitProps(obj, ["a"]);
    expect(obj).toEqual(copy);
  });

  it("should work with various value types", () => {
    const obj = {
      num: 42,
      str: "hello",
      arr: [1, 2],
      nested: { x: 1 },
    };
    expect(omitProps(obj, ["arr", "nested"])).toEqual({
      num: 42,
      str: "hello",
    });
  });

  it("should handle Date objects correctly", () => {
    const date = new Date();
    expect(omitProps({ createdAt: date, name: "test" }, ["createdAt"])).toEqual(
      {
        name: "test",
      }
    );
  });

  it("should omit keys with null or undefined values", () => {
    const obj = { a: null, b: undefined, c: 3 };
    expect(omitProps(obj, ["a"])).toEqual({ b: undefined, c: 3 });
  });

  it("should skip omitting if arrayExcept is empty and object has many properties", () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(omitProps(obj, [])).toEqual(obj);
  });

  it("should handle object being undefined or null gracefully", () => {
    expect(omitProps(undefined as any, ["a"])).toBeUndefined();
    expect(omitProps(null as any, ["a"])).toBeUndefined();
  });

  it("should support deeply nested object but only omit top-level keys", () => {
    const obj = {
      a: {
        b: {
          c: 1,
        },
      },
      x: 10,
    };
    expect(omitProps(obj, ["a"])).toEqual({ x: 10 });
  });

  it("should throw if arrayExcept is not an array type", () => {
    // @ts-expect-error intentionally invalid
    expect(() => omitProps({ a: 1 }, "a")).toThrow(TypeError);
    // @ts-expect-error intentionally invalid
    expect(() => omitProps({ a: 1 }, null)).toThrow(TypeError);
    // @ts-expect-error intentionally invalid
    expect(() => omitProps({ a: 1 }, 123)).toThrow(TypeError);
    // @ts-expect-error intentionally invalid
    expect(() => omitProps({ a: 1 }, undefined)).toThrow(TypeError);
  });
});
