import { Post, ProviderContext } from "../types";
const BASE = "https://playhdporn.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

async function parseHtml(html: string, cheerio: any): Promise<Post[]> {
  const $ = cheerio.load(html || "");
  const posts: Post[] = [];
  const seen = new Set<string>();
  $("a[href*='/video/']").each((_: any, el: any) => {
    const $el = $(el);
    const link = $el.attr("href");
    if (!link || !link.includes("/video/") || seen.has(link)) return;
    const fullLink = link.startsWith("http") ? link : BASE + link;
    seen.add(fullLink);
    const title = $el.attr("title") || $el.find("img").attr("alt") || $el.text().trim() || "Video";
    let image = $el.find("img").attr("src") || $el.find("img").attr("data-src") || "";
    if (image && image.startsWith("//")) image = "https:" + image;
    if (image && image.startsWith("/")) image = BASE + image;
    if (!image) {
      const videoId = link.match(/\/video\/([^/]+)/)?.[1];
      if (videoId) image = `${BASE}/contents/videos_screenshots/25000/${videoId}/320x180/1.jpg`;
    }
    if (title) posts.push({ title, link: fullLink, image });
  });
  return posts.slice(0, 30);
}

export async function getPosts({ page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = page > 1 ? `${BASE}/latest-updates/?page=${page}` : `${BASE}/latest-updates/`;
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 25000 });
    return await parseHtml(res.data, cheerio);
  } catch { return []; }
}

export async function getSearchPosts({ searchQuery, page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = `${BASE}/search/?q=${encodeURIComponent(searchQuery)}&page=${page || 1}`;
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 25000 });
    return await parseHtml(res.data, cheerio);
  } catch { return []; }
}
