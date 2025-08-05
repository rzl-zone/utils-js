import { describe, it, expect } from "vitest";
import { extractFileName } from "@/index";

describe("extractFileName", () => {
  it("should extract file name without extension from URL", () => {
    expect(extractFileName("https://example.com/path/to/file.txt")).toBe(
      "file"
    );
  });

  it("should extract file name without extension from local path", () => {
    expect(extractFileName("/local/path/to/image.jpeg")).toBe("image");
  });

  it("should handle file without extension", () => {
    expect(extractFileName("https://example.com/path/to/no-extension")).toBe(
      "no-extension"
    );
  });

  it("should handle filenames with multiple dots, removing only last extension", () => {
    expect(extractFileName("/path/to/my.archive.v1.2.3.tar.gz")).toBe(
      "my.archive.v1.2.3"
    );
  });

  it("should extract file name without multiple extensions", () => {
    expect(extractFileName("/path/to/archive.tar.gz")).toBe("archive");
    expect(extractFileName("backup.2024-pertama.sql.gz")).toBe(
      "backup.2024-pertama"
    );
    expect(extractFileName("project.release.v1.0.0.tar.bz2")).toBe(
      "project.release.v1.0.0"
    );
  });

  it("should handle file in root path", () => {
    expect(extractFileName("/file.pdf")).toBe("file");
  });

  it("should return undefined for empty string", () => {
    expect(extractFileName("")).toBeUndefined();
  });

  it("should return undefined for whitespace string", () => {
    expect(extractFileName("    ")).toBeUndefined();
  });

  it("should return undefined for non-string values", () => {
    // @ts-expect-error
    expect(extractFileName(null)).toBeUndefined();
    // @ts-expect-error
    expect(extractFileName(undefined)).toBeUndefined();
    // @ts-expect-error
    expect(extractFileName(123)).toBeUndefined();
    // @ts-expect-error
    expect(extractFileName({})).toBeUndefined();
  });

  it("should return empty string if last segment is empty (path ends with slash)", () => {
    expect(extractFileName("https://example.com/path/to/")).toBe("");
    expect(extractFileName("/local/path/to/")).toBe("");
  });

  it("should extract correctly from simple file name", () => {
    expect(extractFileName("file.txt")).toBe("file");
    expect(extractFileName("file")).toBe("file");
  });

  it("should handle exotic file extensions from large known list", () => {
    expect(extractFileName("document.epub")).toBe("document");
    expect(extractFileName("image.heic")).toBe("image");
    expect(extractFileName("model.stl")).toBe("model");
    expect(extractFileName("track.flac")).toBe("track");
    expect(extractFileName("film.webm")).toBe("film");
    expect(extractFileName("project.sln")).toBe("project");
    expect(extractFileName("vector.ai")).toBe("vector");
  });

  it("should handle double extensions beyond common tar", () => {
    expect(extractFileName("archive.tar.lz")).toBe("archive");
    expect(extractFileName("bundle.tar.zst")).toBe("bundle");
  });

  it("should ignore non-matching extensions and keep full", () => {
    expect(extractFileName("weirdfile.foobar")).toBe("weirdfile.foobar"); // unknown ext stays
    expect(extractFileName("odd.file.name.qwerty")).toBe(
      "odd.file.name.qwerty"
    );
  });

  it("should handle long chains and only strip known", () => {
    expect(extractFileName("dataset.csv.gz")).toBe("dataset");
    expect(extractFileName("experiment.tsv.bz2")).toBe("experiment");
    expect(extractFileName("series.json.xz")).toBe("series");
  });

  it("should support partial strips for known+unknown chain", () => {
    expect(extractFileName("research.xml.abc")).toBe("research.xml.abc");
    expect(extractFileName("presentation.pptx.unknownext")).toBe(
      "presentation.pptx.unknownext"
    );
  });
});
