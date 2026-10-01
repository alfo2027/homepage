import { expect, test, vi } from "vitest";
import { publishedPosts, postAsset } from "./posts";

test("only explicitly published posts appear, newest first, without mutating the source", () => {
  const entries = [
    { slug: "old", status: "published", date: "2026-01-01" },
    { slug: "draft", status: "draft", date: "2026-09-30" },
    { slug: "new", status: "published", date: "2026-09-28" },
    { slug: "unfinished", date: "2026-09-29" },
  ];
  expect(publishedPosts(entries).map((post) => post.slug)).toEqual(["new", "old"]);
  expect(entries[0].slug).toBe("old");
  expect(publishedPosts([])).toEqual([]);
});

test("blog images respect the GitHub Pages base path", () => {
  vi.stubEnv("BASE_URL", "/homepage/");
  expect(postAsset("/assets/blog/photo.jpg")).toBe("/homepage/assets/blog/photo.jpg");
  vi.unstubAllEnvs();
});
