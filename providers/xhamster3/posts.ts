import { Post } from "../types";
const BASE = "https://xhamster.com";
export async function getPosts({ page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(`${BASE}/categories/all?page=${page}`, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts: Post[] = [];
    const seen = new Set<string>();
    $("a[href*='/videos/']").each((_: any, el: any) => {
      let link = $(el).attr("href") || "";
      if (!link || !/\/videos\/[^/?#]+/i.test(link)) return;
      if (link.startsWith("/")) link = BASE + link;
      link = link.split("?")[0];
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
  return [];
}
