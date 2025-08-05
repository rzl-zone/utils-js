import { removeObjectPathsDeprecated } from "@/conversions/object/deprecated";
import { describe, expect, it } from "vitest";

describe("removeObjectPathsDeprecated - exhaustive tests", () => {
  it("handles empty object", () => {
    const obj = {};
    const result = removeObjectPathsDeprecated(
      obj,
      // @ts-expect-error ignore cause test if empty
      [{ key: "a" }],
      true
    );
    expect(result).toEqual({});
  });

  it("handles empty array", () => {
    const obj: any = [];
    const result = removeObjectPathsDeprecated(
      obj,
      [{ key: "a", deep: true }],
      true
    );
    expect(result).toEqual([]);
  });

  it("skips non-existent keys gracefully", () => {
    const obj = { a: 1 };
    const result = removeObjectPathsDeprecated(
      obj,
      // @ts-expect-error ignore cause test if not exist key
      [{ key: "b" }, { key: "c", deep: true }],
      true
    );
    expect(result).toEqual({ a: 1 });
  });

  it("handles nested object up to 5 levels", () => {
    const obj = { a: { b: { c: { d: { e: { f: 100 } } } } } };
    const result = removeObjectPathsDeprecated(
      obj,
      [{ key: "f", deep: true }],
      true
    );
    expect(result).toEqual({ a: { b: { c: { d: { e: {} } } } } });
  });

  it("handles shallow and deep combined", () => {
    const obj = {
      x: 1,
      meta: { id: "abc", keep: true },
      arr: [
        { id: 1, password: "sec" },
        { id: 2, password: "top" },
      ],
    };
    const result = removeObjectPathsDeprecated(
      obj,
      [{ key: "meta" }, { key: "password", deep: true }],
      true
    );
    expect(result).toEqual({
      x: 1,
      arr: [{ id: 1 }, { id: 2 }],
    });
  });

  it("deepClone=false mutates original deeply", () => {
    const obj = {
      user: { credentials: { email: "a@b.com", password: "secret" } },
    };
    const result = removeObjectPathsDeprecated(
      obj,
      [{ key: "password", deep: true }],
      false
    );

    expect(obj).toEqual({ user: { credentials: { email: "a@b.com" } } });
    expect(result).toBe(obj);
  });

  it("deepClone=true original completely unchanged", () => {
    const obj = {
      user: { credentials: { email: "a@b.com", password: "secret" } },
    };
    const result = removeObjectPathsDeprecated(
      obj,
      [{ key: "password", deep: true }],
      true
    );

    expect(result).toEqual({ user: { credentials: { email: "a@b.com" } } });
    expect(obj.user.credentials.password).toBe("secret"); // original intact
    expect(result).not.toBe(obj);
    expect(result.user).not.toBe(obj.user); // deep clone reference
  });

  it("does nothing on non-object types", () => {
    // @ts-expect-error ignore cause test if not valid object
    expect(removeObjectPathsDeprecated(null, [{ key: "a" }])).toEqual({});
    expect(removeObjectPathsDeprecated(123 as any, [{ key: "a" }])).toEqual({});
    expect(removeObjectPathsDeprecated("abc" as any, [{ key: "a" }])).toEqual(
      {}
    );
    expect(removeObjectPathsDeprecated(true as any, [{ key: "a" }])).toEqual(
      {}
    );
    expect(
      removeObjectPathsDeprecated(undefined as any, [{ key: "a" }])
    ).toEqual({});
  });

  it("processes root array with objects inside", () => {
    const obj = [
      { id: 1, secret: "x" },
      { id: 2, secret: "y" },
    ];
    const result = removeObjectPathsDeprecated(
      // @ts-expect-error ignore cause test if not valid Object
      obj,
      [{ key: "secret", deep: true }],
      true
    );
    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it("works when array inside object contains arrays again", () => {
    const obj = {
      groups: [
        [
          { id: 1, secret: "x" },
          { id: 2, secret: "y" },
        ],
        [{ id: 3, secret: "z" }],
      ],
    };
    const result = removeObjectPathsDeprecated(
      obj,
      [{ key: "secret", deep: true }],
      true
    );
    expect(result).toEqual({
      groups: [[{ id: 1 }, { id: 2 }], [{ id: 3 }]],
    });
  });

  it("deepClone=false propagates reference mutation down to nested", () => {
    const obj = { outer: { inner: { secret: "boom" } } };
    const result = removeObjectPathsDeprecated(
      obj,
      [{ key: "secret", deep: true }],
      false
    );
    expect(obj).toEqual({ outer: { inner: {} } });
    expect(result).toBe(obj);
    expect(obj.outer.inner).toEqual({});
  });
});
