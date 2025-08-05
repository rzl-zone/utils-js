import { describe, it, expect } from "vitest";
import { doesKeyExist } from "@/index";

describe("doesKeyExist (additional tests)", () => {
  it("should return true if key exists in object directly inside array", () => {
    expect(doesKeyExist([{ x: 1 }, { y: 2 }], "y")).toBe(true);
    expect(doesKeyExist([{ x: 1 }, { y: 2 }], "z")).toBe(false);
  });

  it("should handle arrays with holes (sparse arrays)", () => {
    const arr = [];
    arr[3] = { deep: "value" };
    expect(doesKeyExist(arr, "deep")).toBe(true);
    expect(doesKeyExist(arr, "missing")).toBe(false);
  });

  it("should work with function values (not keys)", () => {
    const obj = {
      fn: () => "test",
    };
    expect(doesKeyExist(obj, "fn")).toBe(true);
    expect(doesKeyExist(obj, "toString")).toBe(false); // prototype, not own
  });

  it("should handle array of arrays", () => {
    const data = [[{ a: 1 }], [{ b: 2 }]];
    expect(doesKeyExist(data, "a")).toBe(true);
    expect(doesKeyExist(data, "b")).toBe(true);
    expect(doesKeyExist(data, "c")).toBe(false);
  });

  it("should return true if key exists in deeply nested mixed structure", () => {
    const complex = {
      level1: [{ level2: { level3: [{ level4: "found" }] } }, {}],
    };
    expect(doesKeyExist(complex, "level4")).toBe(true);
    expect(doesKeyExist(complex, "missing")).toBe(false);
  });

  it("should not be confused by inherited properties (no prototype chain)", () => {
    const proto = { inherited: true };
    const obj = Object.create(proto);
    obj.own = true;

    expect(doesKeyExist(obj, "own")).toBe(true);
    expect(doesKeyExist(obj, "inherited")).toBe(false); // does NOT exist directly
  });

  it("should correctly handle nested null and undefined", () => {
    const data = { a: null, b: undefined, c: { d: null } };
    expect(doesKeyExist(data, "a")).toBe(true);
    expect(doesKeyExist(data, "b")).toBe(true);
    expect(doesKeyExist(data, "d")).toBe(true); // value is null, no nested key
  });

  it("should skip over non-object non-array values safely", () => {
    const weird = { a: 1, b: "string", c: true, d: null };
    expect(doesKeyExist(weird, "toString")).toBe(false);
  });

  it("should throw if key is a function (invalid key type)", () => {
    // @ts-expect-error
    expect(() => doesKeyExist({ a: 1 }, () => "bad")).toThrow(
      `props 'key' must be \`string\`, \`number\` or \`symbol\` type!`
    );
  });

  it("should handle nested objects inside arrays inside objects inside arrays (super nested)", () => {
    const data = [
      {
        obj: [
          {
            deep: { key: "exists" },
          },
        ],
      },
    ];
    expect(doesKeyExist(data, "key")).toBe(true);
    expect(doesKeyExist(data, "notThere")).toBe(false);
  });
});

describe("doesKeyExist (invalid key type checks)", () => {
  it("should throw TypeError if key is a boolean", () => {
    // @ts-expect-error Test invalid props.
    expect(() => doesKeyExist({ a: 1 }, true)).toThrow(
      "props 'key' must be `string`, `number` or `symbol` type!"
    );
  });

  it("should throw TypeError if key is an object", () => {
    // @ts-expect-error Test invalid props.
    expect(() => doesKeyExist({ a: 1 }, { k: "v" })).toThrow(
      "props 'key' must be `string`, `number` or `symbol` type!"
    );
  });

  it("should throw TypeError if key is an array", () => {
    // @ts-expect-error Test invalid props.
    expect(() => doesKeyExist({ a: 1 }, ["key"])).toThrow(
      "props 'key' must be `string`, `number` or `symbol` type!"
    );
  });

  it("should throw TypeError if key is a function", () => {
    // @ts-expect-error Test invalid props.
    expect(() => doesKeyExist({ a: 1 }, () => "k")).toThrow(
      "props 'key' must be `string`, `number` or `symbol` type!"
    );
  });

  it("should throw TypeError if key is null", () => {
    expect(() => doesKeyExist({ a: 1 }, null as any)).toThrow(
      "props 'key' must be `string`, `number` or `symbol` type!"
    );
  });

  it("should throw TypeError if key is undefined", () => {
    expect(() => doesKeyExist({ a: 1 }, undefined as any)).toThrow(
      "props 'key' must be `string`, `number` or `symbol` type!"
    );
  });
});
