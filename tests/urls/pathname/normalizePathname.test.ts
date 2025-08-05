import { describe, it, expect, vi } from "vitest";

import { normalizePathname, NormalizePathnameError } from "@/index";
import * as Utils from "@/strings/sanitize";

describe("normalizePathname", () => {
  it("should return defaultPath if pathname is null, undefined, empty or whitespace", () => {
    expect(normalizePathname()).toBe("/");
    expect(normalizePathname(undefined)).toBe("/");
    expect(normalizePathname(null)).toBe("/");
    expect(normalizePathname("")).toBe("/");
    expect(normalizePathname("    ")).toBe("/");
  });

  it("should use provided defaultPath if pathname is invalid", () => {
    expect(normalizePathname(null, "/home")).toBe("/home");
    expect(normalizePathname(undefined, "/dashboard")).toBe("/dashboard");
  });

  it("should throw TypeError if defaultPath is not valid", () => {
    expect(() => normalizePathname("test", null as any)).toThrow(TypeError);
    expect(() => normalizePathname("test", 123 as any)).toThrow(TypeError);
    expect(() => normalizePathname("test", "")).toThrow(TypeError);
    expect(() => normalizePathname("test", "    ")).toThrow(TypeError);
  });

  it("should prepend slash to relative pathnames", () => {
    expect(normalizePathname("test")).toBe("/test");
    expect(normalizePathname("folder/sub")).toBe("/folder/sub");
    expect(normalizePathname("/already/starts")).toBe("/already/starts");
    expect(normalizePathname("///multiple/slashes")).toBe("/multiple/slashes");
  });

  it("should normalize full URLs and extract pathname + search + hash", () => {
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

  it("should strip leading spaces but preserve inside", () => {
    expect(normalizePathname("   my/path  ")).toBe("/my/path");
    expect(normalizePathname("   a / b / c ")).toBe("/a/b/c");
  });

  it("should fallback to defaultPath for input like whitespace strings", () => {
    expect(normalizePathname("    ", "/alt")).toBe("/alt");
  });

  it("should handle complex combinations", () => {
    expect(normalizePathname("http://site.com///multi////slashes")).toBe(
      "/multi////slashes"
    );
    expect(normalizePathname("/double//slashes")).toBe("/double/slashes");
    expect(normalizePathname("/double///slashes///")).toBe("/double/slashes/");
    expect(normalizePathname("nested/path/🚀")).toBe("/nested/path/🚀");
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
