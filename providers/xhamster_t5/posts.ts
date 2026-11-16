import { Post, ProviderContext } from "../types";
const BASE = "https://xhamster.com";
const UA = "Mozilla/5.0";
export async function getPosts({ page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = `${BASE}/videos?page=${page || 1}`;
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts: Post[] = [];
    $("a[href*='/videos/']").each((_: any, el: any) => {
      const $el = $(el);
      const link = $el.attr("href");
      if (!link || link.includes("/videos?")) return;
      const title = $el.attr("title") || $el.find("img").attr("alt") || "Video";
      let image = $el.find("img").attr("data-src") || $el.find("img").attr("src") || "";
      if (image && image.startsWith("//")) image = "https:" + image;
      if (link && title) posts.push({ title, link: link.startsWith("http") ? link : BASE + link, image });
    });
    return posts.slice(0, 30);
  } catch { return []; }
}
export async function getSearchPosts({ searchQuery, page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = `${BASE}/search/${encodeURIComponent(searchQuery)}?page=${page}`;
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts: Post[] = [];
    $("a[href*='/videos/']").each((_: any, el: any) => {
      const $el = $(el);
      const link = $el.attr("href");
      if (!link) return;
      const title = $el.attr("title") || "Result";
      let image = $el.find("img").attr("data-src") || $el.find("img").attr("src") || "";
      if (image && image.startsWith("//")) image = "https:" + image;
      posts.push({ title, link: link.startsWith("http") ? link : BASE + link, image });
    });
    return posts.slice(0, 30);
  } catch { return []; }
}
