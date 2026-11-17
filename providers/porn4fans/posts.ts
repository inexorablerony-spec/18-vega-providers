import { Post, ProviderContext } from "../types";
const BASE = "https://www.porn4fans.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

function parsePosts($: any, seen: Set<string>): Post[] {
  const posts: Post[] = [];
  $("a[href*='/video/']").each((_: any, el: any) => {
    const $el = $(el);
    const link = $el.attr("href");
    if (!link || !link.includes("/video/")) return;
    const fullLink = link.startsWith("http") ? link : BASE + link;
    if (seen.has(fullLink)) return;
    seen.add(fullLink);
    const title = $el.attr("title") || $el.find("img").attr("alt") || $el.text().trim() || "Video";
    let image = $el.find("img").attr("data-src") || $el.find("img").attr("src") || "";
    if (image && image.startsWith("//")) image = "https:" + image;
    if (image && image.startsWith("/")) image = BASE + image;
    if (title) posts.push({ title, link: fullLink, image });
  });
  return posts;
}

export async function getPosts({ page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = page > 1 ? `${BASE}/?page=${page}` : `${BASE}/`;
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
    const url = `${BASE}/search/?q=${q}&page=${page || 1}`;
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const seen = new Set<string>();
    return parsePosts($, seen).slice(0, 30);
  } catch { return []; }
}
