import { Post, ProviderContext } from "../types";
const BASE = "https://sxyprn.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
export async function getPosts({ page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = page > 1 ? `${BASE}/trending.html?page=${page}` : `${BASE}/trending.html`;
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
      posts.push({ title: title.replace(/\s*video$/i, "").trim(), link: link.startsWith("http") ? link : BASE + link, image });
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
      posts.push({ title, link: link.startsWith("http") ? link : BASE + link, image });
    });
    return posts.slice(0, 30);
  } catch { return []; }
}
