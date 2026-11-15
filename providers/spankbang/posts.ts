import { Post } from "../types";
const BASE = "https://spankbang.com";
export async function getPosts({ page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(`${BASE}/?page=${page}`, { headers: { "User-Agent": "Mozilla/5.0", "Referer": BASE + "/" }, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts: Post[] = [];
    const seen = new Set<string>();
    $("a[href]").each((_: any, el: any) => {
      let href = $(el).attr("href") || "";
      const match = href.match(/^\/?([a-z0-9]+)\/video(?:\/([^?#]+))?/i);
      if (!match) return;
      const link = `${BASE}/${match[1]}/video/${match[2] || ""}`;
      if (seen.has(link)) return;
      seen.add(link);
      const title = $(el).attr("title") || $(el).find("img").attr("alt") || $(el).text().trim();
      let image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || "";
      if (image.startsWith("//")) image = "https:" + image;
      if (title && title.length > 2) posts.push({ title, link, image });
    });
    return posts.slice(0, 40);
  } catch { return []; }
}
export async function getSearchPosts({ searchQuery, page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(`${BASE}/s/${encodeURIComponent(searchQuery)}/?page=${page}`, { headers: { "User-Agent": "Mozilla/5.0", "Referer": BASE + "/" }, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts: Post[] = [];
    const seen = new Set<string>();
    $("a[href]").each((_: any, el: any) => {
      let href = $(el).attr("href") || "";
      const match = href.match(/^\/?([a-z0-9]+)\/video(?:\/([^?#]+))?/i);
      if (!match) return;
      const link = `${BASE}/${match[1]}/video/${match[2] || ""}`;
      if (seen.has(link)) return;
      seen.add(link);
      const title = $(el).attr("title") || $(el).find("img").attr("alt") || $(el).text().trim();
      let image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || "";
      if (image.startsWith("//")) image = "https:" + image;
      if (title) posts.push({ title, link, image });
    });
    return posts.slice(0, 40);
  } catch { return []; }
}
