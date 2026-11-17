import { Post, ProviderContext } from "../types";
const BASE = "https://www.mykamababa.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

function parsePosts($: any, seen: Set<string>): Post[] {
  const posts: Post[] = [];
  $("a[href*='mykamababa.com/']").each((_: any, el: any) => {
    const $el = $(el);
    const link = $el.attr("href");
    if (!link || link.includes("/page/") || link.includes("/category/") || link.includes("/tag/") || link.includes("/wp-content/")) return;
    if (seen.has(link)) return;
    seen.add(link);
    const title = $el.attr("title") || $el.find("img").attr("alt") || $el.text().trim() || "Video";
    let image = $el.find("img").attr("data-src") || $el.find("img").attr("src") || "";
    if (image && image.startsWith("//")) image = "https:" + image;
    if (title && link.includes("-")) posts.push({ title, link, image });
  });
  return posts;
}

export async function getPosts({ page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = page > 1 ? `${BASE}/page/${page}/` : `${BASE}/`;
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const seen = new Set<string>();
    return parsePosts($, seen).slice(0, 30);
  } catch { return []; }
}

export async function getSearchPosts({ searchQuery, page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const q = encodeURIComponent(searchQuery);
    const url = page > 1 ? `${BASE}/page/${page}/?s=${q}` : `${BASE}/?s=${q}`;
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const seen = new Set<string>();
    return parsePosts($, seen).slice(0, 30);
  } catch { return []; }
}
