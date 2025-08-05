import { describe, it, expect } from "vitest";
import { ExtractRouteParams, generateRoute, HasDynamicSegments } from "@/next";

describe("generateRoute", () => {
  it("should replace dynamic segments correctly", () => {
    const result = generateRoute("/user/[id]", { id: "123" });
    expect(result).toBe("/user/123");
  });

  it("should replace multiple dynamic segments", () => {
    const result = generateRoute("/post/[category]/[slug]", {
      category: "tech",
      slug: "new-laptop",
    });
    expect(result).toBe("/post/tech/new-laptop");
  });

  it("should handle leading/trailing slashes in param values", () => {
    expect(() =>
      generateRoute("/blog/[category]/[slug]", {
        category: "/news",
        slug: "/latest-update/test/",
      })
    ).toThrow(
      `🚨 'generateRoute' Failed cause in route "/blog/[category]/[slug]":\n- Parameter "category" contains slashes "/" which is not allowed.\n- Parameter "slug" contains slashes "/" which is not allowed.`
    );
  });

  it("should throw error if contain slash", () => {
    expect(() =>
      generateRoute("/files/[folder]/[file]", {
        folder: "/docs//",
        file: "///readme//test//",
      })
    ).toThrow(
      `🚨 'generateRoute' Failed cause in route "/files/[folder]/[file]":\n- Parameter "folder" contains slashes "/" which is not allowed.\n- Parameter "file" contains slashes "/" which is not allowed.`
    );
  });

  it("should return static route unchanged if no dynamic segments", () => {
    expect(generateRoute("/dashboard")).toBe("/dashboard");
  });

  it("should throw error if param missing", () => {
    // @ts-expect-error
    expect(() => generateRoute("/profile/[username]", {})).toThrow(
      `🚨 'generateRoute' Failed cause in route "/profile/[username]":\n- Missing parameter: "username".`
    );
  });

  it("should throw error if param value is empty", () => {
    expect(() =>
      generateRoute("/post/[category]/[slug]", { category: "", slug: "" })
    ).toThrow(
      `🚨 'generateRoute' Failed cause in route "/post/[category]/[slug]":\n- Parameter "category" cannot be empty.\n- Parameter "slug" cannot be empty.`
    );
  });

  it("should throw error for invalid characters in param", () => {
    expect(() =>
      generateRoute("/search/[query]", { query: "how to?learn" })
    ).toThrow(
      `🚨 'generateRoute' Failed cause in route "/search/[query]":\n- Parameter "query" contains invalid characters (?, ). These characters are not allowed because they could cause issues in URL structure. The following characters are forbidden in route parameters: (?, &, #, =, /,  , ', ", (, ), +, ;, %, @, :).`
    );
  });

  it("should throw error if route is not string", () => {
    expect(() => generateRoute(undefined as any)).toThrow(/Invalid 'route'/);
  });

  it("should throw error if params is not object", () => {
    expect(() => generateRoute("/user/[id]", undefined as any)).toThrow(
      /Missing or invalid parameters object/
    );
    expect(() => generateRoute("/user/[id]", [] as any)).toThrow(
      /Missing or invalid parameters object/
    );
  });

  it("should handle case with dynamic segments but missing params entirely", () => {
    expect(() => (generateRoute as any)("/user/[id]")).toThrow(
      /Missing or invalid parameters object/
    );
  });

  it("should allow route with no dynamic segments and missing params", () => {
    expect(generateRoute("/about")).toBe("/about");
  });

  it("should enforce HasDynamicSegments type - TS only", () => {
    // purely compile-time, no runtime test
    type Case1 = HasDynamicSegments<"/user/[id]">; // true
    type Case2 = HasDynamicSegments<"/settings">; // false
    type Case3 = ExtractRouteParams<"/post/[slug]/comment/[id]">;
    // Expect: { slug: string; id: string }
    const params: Case3 = { slug: "a", id: "b" };
    expect(params).toEqual({ slug: "a", id: "b" });
  });
});
