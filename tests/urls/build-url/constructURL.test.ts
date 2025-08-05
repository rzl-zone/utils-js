import { constructURL } from "@/index";
import { describe, it, expect } from "vitest";

describe("constructURL", () => {
  it("should construct a URL with just the base string", () => {
    const result = constructURL("https://example.com");
    expect(result.href).toBe("https://example.com/");
  });

  it("should construct a URL from a URL instance", () => {
    const base = new URL("https://example.com/test");
    const result = constructURL(base);
    expect(result.href).toBe("https://example.com/test");
  });

  it("should append query parameters from iterable", () => {
    const params = new URLSearchParams({ foo: "1", bar: "2" }).entries();
    const result = constructURL("https://example.com", params);
    expect(result.href).toBe("https://example.com/?foo=1&bar=2");
  });

  it("should remove specified query parameters", () => {
    const params = new URLSearchParams({
      foo: "1",
      bar: "2",
      baz: "3",
    }).entries();
    const result = constructURL("https://example.com", params, ["bar"]);
    expect(result.href).toBe("https://example.com/?foo=1&baz=3");
  });

  it("should remove existing query parameters in URL even without extra queryParams", () => {
    const base = "https://example.com/path?foo=1&bar=2";
    const result = constructURL(base, undefined, ["bar"]);
    expect(result.href).toBe("https://example.com/path?foo=1");
  });

  it("should append and also remove specified query parameters simultaneously", () => {
    const base = "https://example.com/path?foo=1&bar=2";
    const params = new URLSearchParams({
      qux: "9",
      bar: "should-be-removed",
    }).entries();
    const result = constructURL(base, params, ["bar"]);
    expect(result.href).toBe("https://example.com/path?foo=1&qux=9");
  });

  it("should handle empty queryParams iterable", () => {
    // @ts-expect-error ignore for test only
    const result = constructURL("https://example.com", [].entries());
    expect(result.href).toBe("https://example.com/");
  });

  it("should throw on empty baseUrl string", () => {
    expect(() => constructURL("")).toThrow(
      "`baseUrl` cannot be an empty string."
    );
  });

  it("should throw on non-string, non-URL baseUrl", () => {
    // @ts-expect-error testing runtime
    expect(() => constructURL(123)).toThrow(
      "Invalid 'baseUrl'. Expected a non-empty string or a URL instance"
    );
  });

  it("should throw on invalid queryParams that is not iterable", () => {
    // @ts-expect-error testing runtime
    expect(() => constructURL("https://example.com", 123)).toThrow(
      "must be iterable"
    );
  });

  it("should throw on invalid removeParams type", () => {
    expect(() =>
      // @ts-expect-error testing runtime
      constructURL("https://example.com", undefined, "not-array")
    ).toThrow("`removeParams` must be an array");
  });

  it("should throw on invalid removeParams content", () => {
    // @ts-expect-error testing runtime
    expect(() => constructURL("https://example.com", undefined, [123])).toThrow(
      "`removeParams` must only contain strings"
    );
  });
});
