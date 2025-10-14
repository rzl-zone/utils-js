import { describe, it, expect } from "vitest";
import sldMap from "../../../src/predicates/is/_private/data/domain/sldMap.json";
import { isValidDomain } from "@/predicates/is/isValidDomain";

describe("isValidDomain", () => {
  it("should validate standard domains", () => {
    expect(isValidDomain("example.com")).toBe(true);
    expect(isValidDomain("sub.example.com")).toBe(true);
    expect(isValidDomain("example")).toBe(false);
    expect(isValidDomain("exa_mple.com")).toBe(false); // invalid char
  });

  it("should validate Unicode domains with allowUnicode option", () => {
    expect(isValidDomain("пример.рф")).toBe(false);
    expect(isValidDomain("пример.рф", { allowUnicode: true })).toBe(true);
    expect(isValidDomain("xn--e1afmkfd.xn--p1ai")).toBe(true);
  });

  it("should validate top-level domains only", () => {
    expect(isValidDomain("ai", { topLevel: true })).toBe(true);
    expect(isValidDomain("ai.", { topLevel: true })).toBe(true);
    expect(isValidDomain("com", { topLevel: true })).toBe(false);
  });

  it("should handle subdomain restriction", () => {
    expect(isValidDomain("sub.example.com", { subdomain: false })).toBe(false);
    expect(isValidDomain("example.com", { subdomain: false })).toBe(true);
  });

  it("should handle wildcard domains", () => {
    expect(isValidDomain("*.example.com", { wildcard: true })).toBe(true);
    expect(isValidDomain("*.sub.example.com", { wildcard: true })).toBe(true);
    expect(isValidDomain("*.example.com")).toBe(false);
  });

  it("should reject invalid labels", () => {
    expect(isValidDomain("-example.com")).toBe(false); // starts with -
    expect(isValidDomain("example-.com")).toBe(false); // ends with -
    expect(isValidDomain("exa..com")).toBe(false); // double dot
    expect(isValidDomain("ex".repeat(32) + ".com")).toBe(false); // label > 63 chars
  });

  it("should reject non-string values", () => {
    expect(isValidDomain(null)).toBe(false);
    expect(isValidDomain(undefined)).toBe(false);
    expect(isValidDomain(123)).toBe(false);
    expect(isValidDomain({})).toBe(false);
  });

  it("should handle punycode consistency for xn-- labels", () => {
    expect(isValidDomain("xn--fsq.com")).toBe(true); // valid punycode
    expect(isValidDomain("xn--fsq--.com")).toBe(false); // invalid punycode
  });
});

// --- TLD and simple subdomains ---
describe("isValidDomain - tld and simple subdomains", () => {
  const tests = [
    ["example.com", true],
    ["foo.example.com", true],
    ["bar.foo.example.com", true],
    ["exa-mple.co.uk", true],
    ["a.com", true],
    ["a.b", true],
    ["foo.bar.baz", true],
    ["foo-bar.ba-z.qux", true],
    ["hello.world", true],
    ["ex-am-ple.com", true],
    ["xn--80ak6aa92e.com", true],
    ["example.a9", true],
    ["example.9a", true],
    ["example.99", false]
  ];

  tests.forEach(([domain, expected]) => {
    it(`should validate ${domain}`, () => {
      expect(isValidDomain(domain)).toBe(expected);
    });
  });
});

// --- More subdomains ---
describe("isValidDomain - more subdomains", () => {
  const tests: [string, boolean, any?][] = [
    ["example.com", true],
    ["foo.example.com", true],
    ["example.com", true, { subdomain: true }],
    ["foo.example.com", true, { subdomain: true }],
    ["foo.example.com", false, { subdomain: false }],
    ["-foo.example.com", false, { subdomain: true }],
    ["foo-.example.com", false, { subdomain: true }],
    ["-foo-.example.com", false, { subdomain: true }],
    ["-foo.example.com", false],
    ["foo-.example.com", false],
    ["-foo-.example.com", false],
    ["foo-.bar.example.com", false],
    ["-foo.bar.example.com", false],
    ["-foo-.bar.example.com", false],
    ["-foo-.bar.example.com", false, { subdomain: true }],
    ["foo-.bar.example.com", false, { subdomain: true }],
    ["-foo-.bar.example.com", false, { subdomain: true }],
    ["-foo-.-bar-.example.com", false, { subdomain: true }],
    ["example.com", true, { subdomain: false }],
    ["*.example.com", false, { subdomain: true }],
    ["abcd--def.example.com", true, { subdomain: true }],
    ["ab--cd.ab--cd.example.com", true, { subdomain: true }]
  ];

  tests.forEach(([domain, expected, opts]) => {
    it(`should validate ${domain} with opts=${JSON.stringify(opts)}`, () => {
      expect(isValidDomain(domain, opts)).toBe(expected);
    });
  });
});

// --- sld ---
describe("isValidDomain - sld", () => {
  it("should validate known SLDs", () => {
    expect(isValidDomain("example.co.uk")).toBe(true);
    expect(isValidDomain("exampl1.co.uk", { subdomain: false })).toBe(true);
    expect(isValidDomain("abc.example.co.uk", { subdomain: false })).toBe(false);
    expect(isValidDomain("*.example.co.uk", { subdomain: true })).toBe(false);
    expect(isValidDomain("*.example.co.uk", { subdomain: true, wildcard: true })).toBe(
      true
    );
  });

  it("should validate all SLDs from map", () => {
    for (const sld in sldMap) {
      expect(isValidDomain(`example.${sld}`)).toBe(true);
    }
  });
});

// --- punycode / unicode ---
describe("isValidDomain - punycode & unicode", () => {
  const tests: [string, boolean, any?][] = [
    ["xn--6qq79v.xn--fiqz9s", true],
    ["xn--ber-goa.com", true],
    ["xn--a--ber-goa.com", false],
    ["xn--c1yn36f.example.com", true],
    ["xn--addas-o4a.de", true],
    ["xn--p8j9a0d9c9a.xn--q9jyb4c", true],
    ["привет-мир.рф", true, { allowUnicode: true }],
    ["test-me.рф", true, { allowUnicode: true }],
    ["test--me.рф", false, { allowUnicode: true }],
    ["приветмир.com", true, { allowUnicode: true }],
    ["xn--b1aghctohfp.xn--p1ai", true, { allowUnicode: false }],
    ["привет-мир.com", true, { allowUnicode: true }],
    ["привет-мир.рф", true, { allowUnicode: true }],
    ["дядя-ваня.рф", true, { allowUnicode: true }],
    ["дядя-ваня.ru.com", true, { allowUnicode: true }]
  ];

  tests.forEach(([domain, expected, opts]) => {
    it(`should validate ${domain} with opts=${JSON.stringify(opts)}`, () => {
      expect(isValidDomain(domain, opts)).toBe(expected);
    });
  });
});

// --- country code tld ---
describe("isValidDomain - country code tld", () => {
  it("should validate TLDs", () => {
    expect(isValidDomain("ai.")).toBe(false);
    expect(isValidDomain("ai")).toBe(false);
    expect(isValidDomain("ai.", { topLevel: true })).toBe(true);
    expect(isValidDomain("ai", { topLevel: true })).toBe(true);
    expect(isValidDomain("ae.")).toBe(false);
    expect(isValidDomain("ae.", { topLevel: true })).toBe(true);
    expect(isValidDomain("xx.", { topLevel: true })).toBe(false);
  });
});
