import { Post, ProviderContext } from "../types";
const BASE = "https://borntobefuck.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function parseHtml(html: string, cheerio: any): Promise<Post[]> {
  const $ = cheerio.load(html || "");
  const posts: Post[] = [];
  const seen = new Set<string>();
  $("img.thumbnail").each((_: any, el: any) => {
    const $img = $(el);
    const $link = $img.closest("a");
    const link = $link.attr("href") || "";
    if (!link || !link.includes("/watch/") || seen.has(link)) return;
    seen.add(link);
    const title = $img.attr("title") || $img.attr("alt") || "Video";
    const image = $img.attr("src") || "";
    if (title && link) posts.push({ title, link, image });
  });
  return posts;
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
  return [];
}
