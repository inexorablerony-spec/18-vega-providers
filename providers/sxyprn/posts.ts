import { Post } from "../types";
const BASE = "https://sxyprn.com";
export async function getPosts({ page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(`${BASE}/`, { headers: { "User-Agent": "Mozilla/5.0", "Accept": "text/html" }, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts: Post[] = [];
    const seen = new Set<string>();
    // Try multiple selectors
    $("a[href*='/post/'], .post, .post-item, .hash_link").each((_: any, el: any) => {
      let link = $(el).attr("href") || $(el).find("a").attr("href") || "";
      if (!link || !link.includes("/post/")) return;
      if (link.startsWith("/")) link = BASE + link;
      if (seen.has(link)) return;
      seen.add(link);
      const title = $(el).attr("title") || $(el).find("img").attr("alt") || $(el).text().trim() || "SxyPrn Video";
      let image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || "";
      if (image.startsWith("//")) image = "https:" + image;
      if (title.length > 2) posts.push({ title, link, image });
    });
    return posts.slice(0, 40);
  } catch { return []; }
}
export async function getSearchPosts({ searchQuery, page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(`${BASE}/search/${encodeURIComponent(searchQuery).replace(/%20/g, "-")}/`, { headers: { "User-Agent": "Mozilla/5.0" }, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts: Post[] = [];
    const seen = new Set<string>();
    $("a[href*='/post/']").each((_: any, el: any) => {
      let link = $(el).attr("href") || "";
      if (!link || !link.includes("/post/")) return;
      if (link.startsWith("/")) link = BASE + link;
      if (seen.has(link)) return;
      seen.add(link);
      const title = $(el).attr("title") || $(el).text().trim() || "SxyPrn Video";
      let image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || "";
      if (image.startsWith("//")) image = "https:" + image;
      posts.push({ title, link, image });
    });
    return posts.slice(0, 40);
  } catch { return []; }
}
