import { Post } from "../types";
const BASE = "https://xhamster.com";
function absoluteUrl(value: string): string {
  if (!value) return "";
  if (value.startsWith("//")) return "https:" + value;
  if (value.startsWith("/")) return BASE + value;
  return value;
}
export async function getPosts({ page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const response = await axios.get(`${BASE}/videos/new/${page}`, { headers: { "User-Agent": "Mozilla/5.0", "Referer": BASE + "/" }, signal, timeout: 20000 });
    const $ = cheerio.load(response.data || "");
    const posts: Post[] = [];
    const seen = new Set<string>();
    $("a[href]").each((_: any, element: any) => {
      const el = $(element);
      const href = el.attr("href") || "";
      if (!/\/videos\/[^/?#]+/i.test(href)) return;
      const link = absoluteUrl(href).split("?")[0];
      if (seen.has(link)) return;
      seen.add(link);
      const title = el.attr("title") || el.find("img").attr("alt") || el.text().trim();
      const image = absoluteUrl(el.find("img").attr("data-src") || el.find("img").attr("src") || "");
      if (title && image) posts.push({ title, link, image });
    });
    return posts;
  } catch { return []; }
}
export async function getSearchPosts({ searchQuery, page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const response = await axios.get(`${BASE}/search/${encodeURIComponent(searchQuery)}?page=${page}`, { headers: { "User-Agent": "Mozilla/5.0", "Referer": BASE + "/" }, signal, timeout: 20000 });
    const $ = cheerio.load(response.data || "");
    const posts: Post[] = [];
    const seen = new Set<string>();
    $("a[href]").each((_: any, element: any) => {
      const el = $(element);
      const href = el.attr("href") || "";
      if (!/\/videos\/[^/?#]+/i.test(href)) return;
      const link = absoluteUrl(href).split("?")[0];
      if (seen.has(link)) return;
      seen.add(link);
      const title = el.attr("title") || el.find("img").attr("alt") || el.text().trim();
      const image = absoluteUrl(el.find("img").attr("data-src") || el.find("img").attr("src") || "");
      if (title && image) posts.push({ title, link, image });
    });
    return posts;
  } catch { return []; }
}
