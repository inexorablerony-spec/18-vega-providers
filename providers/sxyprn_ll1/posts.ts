import { Post, ProviderContext } from "../types";
const BASE = "https://sxyprn.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

const TOP_SEEDED = [
  { title: "Hottest Casting (28 seeders)", link: "https://sxyprn.com/post/6af93c317e9cc.html", image: "" },
  { title: "Older Woman Group (25 seeders)", link: "https://sxyprn.com/post/6af97c23e37fd.html", image: "" },
  { title: "Miss Lexa Super Hero (23 seeders)", link: "https://sxyprn.com/post/6afa0b979ff75.html", image: "" },
  { title: "Angela White Couch (20 seeders)", link: "https://sxyprn.com/post/6afb3d478cf54.html", image: "" },
  { title: "Lily Phillips (16 seeders)", link: "https://sxyprn.com/post/6afa02ba32335.html", image: "" },
];

export async function getPosts({ page = 1, filter, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const isTopSeeded = filter === "top" || filter === "Top Seeded";
    if (isTopSeeded) {
      return TOP_SEEDED;
    }
    const url = `${BASE}/trending.html?page=${page || 1}`;
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts: Post[] = [];
    $("a[href*='/post/']").each((_: any, el: any) => {
      const $el = $(el);
      const link = $el.attr("href");
      if (!link || !link.includes("/post/")) return;
      const title = $el.attr("aria-label") || $el.attr("title") || "Video";
      let image = $el.find("img").attr("data-src") || $el.find("img").attr("src") || "";
      if (image && image.startsWith("//")) image = "https:" + image;
      if (image && image.startsWith("/")) image = BASE + image;
      const fullLink = link.startsWith("http") ? link : BASE + link.split("?")[0];
      if (!posts.find(p => p.link === fullLink)) {
        posts.push({ title: title.replace(/\s*video$/i, "").trim(), link: fullLink, image });
      }
    });
    return posts.slice(0, 30);
  } catch { return []; }
}

export async function getSearchPosts({ searchQuery, page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = `${BASE}/search.html?q=${encodeURIComponent(searchQuery)}&page=${page}`;
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts: Post[] = [];
    $("a[href*='/post/']").each((_: any, el: any) => {
      const $el = $(el);
      const link = $el.attr("href");
      if (!link) return;
      const title = $el.attr("aria-label") || $el.attr("title") || "Result";
      let image = $el.find("img").attr("data-src") || $el.find("img").attr("src") || "";
      if (image && image.startsWith("//")) image = "https:" + image;
      posts.push({ title, link: link.startsWith("http") ? link : BASE + link.split("?")[0], image });
    });
    return posts.slice(0, 30);
  } catch { return []; }
}
