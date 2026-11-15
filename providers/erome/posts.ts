import { Post } from "../types";
const BASE = "https://www.erome.com";
export async function getPosts({ page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(`${BASE}/?page=${page}`, { headers: { "User-Agent": "Mozilla/5.0", "Accept": "text/html" }, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts: Post[] = [];
    const seen = new Set<string>();
    $("a[href*='/a/']").each((_: any, el: any) => {
      let link = $(el).attr("href") || "";
      if (!link || !/\/a\/[^/?#]+/.test(link)) return;
      if (link.startsWith("/")) link = BASE + link;
      if (!link.startsWith(BASE) || seen.has(link)) return;
      seen.add(link);
      const title = $(el).attr("title") || $(el).text().trim() || "Erome Album";
      let image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || "";
      if (image.startsWith("//")) image = "https:" + image;
      posts.push({ title, link, image });
    });
    return posts.slice(0, 40);
  } catch { return []; }
}
