import { Post, ProviderContext } from "../types";
const BASE = "https://fullporner.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
async function parseHtml(html: string, cheerio: any): Promise<Post[]> {
  const $ = cheerio.load(html || "");
  const posts: Post[] = [];
  const seen = new Set<string>();
  $(".video-card").each((_: any, el: any) => {
    const $el = $(el);
    const $a = $el.find("a").first();
    let link = $a.attr("href") || "";
    if (!link || seen.has(link)) return;
    if (link.startsWith("/")) link = BASE + link;
    seen.add(link);
    const title = $el.find(".video-title").text().trim() || $a.attr("title") || "Video";
    let image = $el.find("img").attr("data-src") || $el.find("img").attr("src") || "";
    if (image && image.startsWith("//")) image = "https:" + image;
    if (image && image.startsWith("/")) image = BASE + image;
    if (title && link) posts.push({ title, link, image });
  });
  return posts.slice(0, 30);
}
export async function getPosts({ page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = page > 1 ? `${BASE}/?page=${page}` : `${BASE}/`;
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 25000 });
    return await parseHtml(res.data, cheerio);
  } catch { return []; }
}
export async function getSearchPosts({ searchQuery, page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = `${BASE}/search?q=${encodeURIComponent(searchQuery)}&page=${page || 1}`;
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 25000 });
    return await parseHtml(res.data, cheerio);
  } catch { return []; }
}
