import { describe, it, expect, vi } from "vitest";

import * as Utils from "@/strings/sanitizations/removeSpaces";
import { normalizePathname } from "@/urls/pathname/normalizePathname";
import { NormalizePathnameError } from "@/urls/_private/NormalizePathnameError";

describe("normalizePathname", () => {
  it("should return defaultPath if pathname is null, undefined, empty or whitespace", () => {
    expect(normalizePathname(undefined)).toBe("/");
    expect(normalizePathname(null)).toBe("/");
    expect(normalizePathname("", { defaultPath: " localhost " })).toBe("/");
    expect(normalizePathname("    ")).toBe("/");
  });

  it("should use provided defaultPath if pathname is invalid", () => {
    expect(normalizePathname(null, { defaultPath: "/home" })).toBe("/home");
    expect(normalizePathname(undefined, { defaultPath: "/dashboard" })).toBe(
      "/dashboard"
    );
  });

  it("should throw TypeError if defaultPath is not valid", () => {
    expect(() => normalizePathname("test", { defaultPath: "" })).toThrow(TypeError);

    expect(() => normalizePathname("test", { defaultPath: "   " })).toThrow(TypeError);

    expect(() => normalizePathname("test", null as any)).toThrow(TypeError);

    expect(() => normalizePathname("test", 123 as any)).toThrow(TypeError);
  });

  it("should prepend slash to relative pathnames", () => {
    expect(normalizePathname("test")).toBe("/test");
    expect(normalizePathname("folder/sub")).toBe("/folder/sub");
    expect(normalizePathname("/*.dom.test/already/starts")).toBe("/already/starts");
    expect(normalizePathname("/test.dom.com/already/starts")).toBe("/already/starts");
    expect(normalizePathname("///multiple/slashes")).toBe("/multiple/slashes");
  });

  it("should normalize full URLs and extract pathname + search + hash", () => {
    expect(normalizePathname("/dashboard///stats?view=all#top")).toBe(
      "/dashboard/stats?view=all#top"
    );
    expect(normalizePathname("https://sub.example.com/path?query=1#hash")).toBe(
      "/path?query=1#hash"
    );
    expect(normalizePathname("/sub.example.com/path?query=1#hash")).toBe(
      "/path?query=1#hash"
    );
    expect(normalizePathname("https://example.com/path?query=1#hash")).toBe(
      "/path?query=1#hash"
    );
    expect(normalizePathname("http://localhost:3000/test")).toBe("/test");
  });

  it("should handle URL with only query and hash", () => {
    expect(normalizePathname("https://domain.com/?x=1#top")).toBe("/?x=1#top");
    expect(normalizePathname("http://site/#anchor")).toBe("/#anchor");
  });

  it("should handle emoji and unicode in pathname", () => {
    expect(normalizePathname("path/🔥/测试")).toBe("/path/🔥/测试");
    expect(normalizePathname("🌍/world")).toBe("/🌍/world");
  });

  it("should strip leading/trailing spaces and collapse internal spaces/slashes", () => {
    expect(normalizePathname("   my/path  ")).toBe("/my/path");
    expect(normalizePathname("   a / b / c ")).toBe("/a/b/c");
  });

  it("should fallback to defaultPath for input like whitespace strings", () => {
    expect(normalizePathname("    ", { defaultPath: "/alt" })).toBe("/alt");
  });

  it("should handle complex combinations", () => {
    expect(normalizePathname("http://site.com///multi////slashes")).toBe(
      "/multi/slashes"
    );
    expect(normalizePathname("/double//slashes")).toBe("/double/slashes");
    expect(normalizePathname("/double///slashes///")).toBe("/double/slashes");
    expect(normalizePathname("nested/path/🚀")).toBe("/nested/path/🚀");

    // expect(
    //   normalizePathname("nested/path/🚀/?test=🚀", { keepTrailingSlash: false })
    // ).toBe("/nested/path/🚀?test=🚀");
  });

  it("should respect keepTrailingSlash option", () => {
    expect(normalizePathname("////", { keepTrailingSlash: true })).toBe("/");

    expect(normalizePathname("/double///slashes", { keepTrailingSlash: true })).toBe(
      "/double/slashes"
    );
    expect(normalizePathname("/double///slashes///", { keepTrailingSlash: true })).toBe(
      "/double/slashes/"
    );
    expect(normalizePathname("/single/slash/", { keepTrailingSlash: false })).toBe(
      "/single/slash"
    );
  });

  it("should handle query search and hash", () => {
    expect(normalizePathname("🚀#hash")).toBe("/🚀#hash");
    expect(normalizePathname("🚀?test=🚀&foo=bar")).toBe("/🚀?test=🚀&foo=bar");

    expect(normalizePathname("nested/path/🚀#hash")).toBe("/nested/path/🚀#hash");
    expect(normalizePathname("nested/path/🚀?test=🚀&foo=bar")).toBe(
      "/nested/path/🚀?test=🚀&foo=bar"
    );

    expect(normalizePathname("nested/path/🚀?test=🚀&foo=bar#hash")).toBe(
      "/nested/path/🚀?test=🚀&foo=bar#hash"
    );

    expect(
      normalizePathname("nested/path/🚀?test=🚀&foo=bar#hash", {
        keepTrailingSlash: true
      })
    ).toBe("/nested/path/🚀?test=🚀&foo=bar#hash");

    expect(normalizePathname("nested/path/🚀/?test=🚀&foo=bar#hash")).toBe(
      "/nested/path/🚀?test=🚀&foo=bar#hash"
    );
    expect(
      normalizePathname("nested/path/🚀/?test=🚀&foo=bar#hash", {
        keepTrailingSlash: true
      })
    ).toBe("/nested/path/🚀/?test=🚀&foo=bar#hash");
  });

  it("should handle query search and hash (with https? domain includes)", () => {
    expect(normalizePathname("http://domain.com/❤️#hash", { keepNullable: true })).toBe(
      "/❤️#hash"
    );
    expect(
      normalizePathname("http://domain.com/❤️?test=❤️&foo=bar", { keepNullable: true })
    ).toBe("/❤️?test=❤️&foo=bar");

    expect(
      normalizePathname("http://domain.com/nested/path/❤️#hash‼️", { keepNullable: true })
    ).toBe("/nested/path/❤️#hash‼️");
    expect(
      normalizePathname("http://domain.com/nested/path/❤️?test=❤️&foo=bar", {
        keepNullable: true
      })
    ).toBe("/nested/path/❤️?test=❤️&foo=bar");

    expect(
      normalizePathname("http://domain.com/nested/path/❤️?test=❤️&foo=bar#hash‼️", {
        keepTrailingSlash: false,
        keepNullable: true
      })
    ).toBe("/nested/path/❤️?test=❤️&foo=bar#hash‼️");

    expect(
      normalizePathname(
        "http://domain.com/nested/path/%E2%9D%A4%EF%B8%8F?test=%E2%9D%A4%EF%B8%8F&foo=bar#hash‼️",
        {
          keepTrailingSlash: true,
          keepNullable: true
        }
      )
    ).toBe("/nested/path/❤️?test=❤️&foo=bar#hash‼️");

    expect(
      normalizePathname("http://domain.com/nested/path/❤️/?test=❤️&foo=bar#hash‼️", {
        keepTrailingSlash: false,
        keepNullable: true
      })
    ).toBe("/nested/path/❤️?test=❤️&foo=bar#hash‼️");
    expect(
      normalizePathname("http://domain.com/nested/path/❤️/?test=❤️&foo=bar#hash‼️", {
        keepTrailingSlash: true,
        keepNullable: true
      })
    ).toBe("/nested/path/❤️/?test=❤️&foo=bar#hash‼️");
  });

  it("should preserve null or undefined if keepNullable is true", () => {
    let a = undefined as unknown as string | null;
    expect(normalizePathname("/search/%2Bitem%2B", { keepNullable: false })).toBe(
      "/search/%2Bitem%2B"
    );
    expect(normalizePathname(a, { keepNullable: true })).toBeUndefined();
    expect(normalizePathname("  ", { keepNullable: true })).toBe("/");
    expect(normalizePathname(null, { keepNullable: true })).toBeNull();
    expect(normalizePathname(undefined, { keepNullable: true })).toBeUndefined();
  });

  it("should throw NormalizePathnameError for internal unexpected errors", () => {
    const spy = vi.spyOn(Utils, "removeSpaces").mockImplementation(() => {
      throw new Error("fake error");
    });

    expect(() => normalizePathname("test")).toThrow(NormalizePathnameError);
    expect(() => normalizePathname("test")).toThrow(/fake error/);

    spy.mockRestore();
  });
});
