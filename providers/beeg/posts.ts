import { Post, ProviderContext } from "../types";
const BASE = "https://beeg.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
export async function getPosts({ page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = page > 1 ? `${BASE}/?page=${page}` : `${BASE}/`;
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 25000 });
    const $ = cheerio.load(res.data || "");
    const posts: Post[] = [];
    const seen = new Set<string>();
    $("a[href*='/']").each((_: any, el: any) => {
      const $el = $(el);
      const link = $el.attr("href");
      if (!link || link.length < 5 || seen.has(link)) return;
      const fullLink = link.startsWith("http") ? link : BASE + link;
      if (!fullLink.includes("beeg.com")) return;
      seen.add(fullLink);
      const title = $el.attr("title") || $el.find("img").attr("alt") || $el.text().trim() || "Video";
      let image = $el.find("img").attr("data-src") || $el.find("img").attr("src") || "";
      if (image && image.startsWith("//")) image = "https:" + image;
      if (title && title.length > 3) posts.push({ title, link: fullLink, image });
    });
    return posts.slice(0, 30);
  } catch { return []; }
}
export async function getSearchPosts(): Promise<Post[]> { return []; }
