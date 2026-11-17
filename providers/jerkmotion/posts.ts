import { Post, ProviderContext } from "../types";
const BASE = "https://www.jerkmotion.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
export async function getPosts({ page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = page > 1 ? `${BASE}/videos/latest?page=${page}` : `${BASE}/videos/latest`;
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 25000 });
    const $ = cheerio.load(res.data || "");
    const posts: Post[] = [];
    const seen = new Set<string>();
    $("a[href*='/video/']").each((_: any, el: any) => {
      const $el = $(el);
      const link = $el.attr("href");
      if (!link || seen.has(link)) return;
      const fullLink = link.startsWith("http") ? link : BASE + link;
      seen.add(fullLink);
      const title = $el.find("img").attr("alt") || $el.text().trim() || "Video";
      let image = $el.find("img").attr("src") || "";
      if (image && image.startsWith("//")) image = "https:" + image;
      if (title) posts.push({ title, link: fullLink, image });
    });
    return posts.slice(0, 30);
  } catch { return []; }
}
export async function getSearchPosts({ searchQuery, page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = `${BASE}/search?q=${encodeURIComponent(searchQuery)}&page=${page || 1}`;
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 25000 });
    const $ = cheerio.load(res.data || "");
    const posts: Post[] = [];
    const seen = new Set<string>();
    $("a[href*='/video/']").each((_: any, el: any) => {
      const $el = $(el);
      const link = $el.attr("href");
      if (!link || seen.has(link)) return;
      const fullLink = link.startsWith("http") ? link : BASE + link;
      seen.add(fullLink);
      const title = $el.find("img").attr("alt") || $el.text().trim() || "Video";
      let image = $el.find("img").attr("src") || "";
      if (image && image.startsWith("//")) image = "https:" + image;
      if (title) posts.push({ title, link: fullLink, image });
    });
    return posts.slice(0, 30);
  } catch { return []; }
}
