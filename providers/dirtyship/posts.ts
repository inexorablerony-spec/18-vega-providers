import { Post, ProviderContext } from "../types";
const BASE = "https://dirtyship.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function parseHtml(html: string, cheerio: any): Promise<Post[]> {
  const $ = cheerio.load(html || "");
  const posts: Post[] = [];
  const seen = new Set<string>();
  $("a[href*='dirtyship.com/']").each((_: any, el: any) => {
    const $el = $(el);
    const link = $el.attr("href");
    if (!link || link.includes("/page/") || link.includes("/wp-") || link.includes("/category/") || link.includes("/tag/") || link.includes("/actor") || link.includes("/performer")) return;
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
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 25000 });
    return await parseHtml(res.data, cheerio);
  } catch { return []; }
}

export async function getSearchPosts({ searchQuery, page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = `${BASE}/?s=${encodeURIComponent(searchQuery)}&paged=${page || 1}`;
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 25000 });
    return await parseHtml(res.data, cheerio);
  } catch { return []; }
}
