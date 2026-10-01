const modules = import.meta.glob("../content/posts/*.json", { eager: true, import: "default" });

export function publishedPosts(entries) {
  return entries.filter((post) => post.status === "published")
    .sort((a, b) => b.date.localeCompare(a.date));
}

export const posts = publishedPosts(Object.values(modules));
export const categories = [...new Set(posts.map((post) => post.category))];
export const postAsset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
export const formatPostDate = (date) => date.replaceAll("-", ".");
