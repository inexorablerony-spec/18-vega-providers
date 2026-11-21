import { Post, ProviderContext } from "../types";
const BASE = "https://fullporner.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

export async function getPosts({ page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = BASE + (page > 1 ? "/page/" + page + "/" : "/");
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts: Post[] = [];
    const seen = new Set<string>();
    $(".video-card a").each((_: any, el: any) => {
      const $el = $(el);
      let link = ($el.attr("href") || "").split("?")[0];
      if (!link || link === "/" || link.startsWith("/category") || link.startsWith("/pornstars")) return;
      if (link.startsWith("/")) link = BASE + link;
      if (seen.has(link)) return;
      seen.add(link);
      const title = $el.attr("title") || $el.find(".video-title").text().trim() || $el.find("img").attr("alt") || "Video";
      let image = $el.find("img").attr("data-src") || $el.find("img").attr("src") || "";
      if (image.startsWith("/")) image = BASE + image;
      if (title.length > 2) posts.push({ title: title.trim().slice(0, 140), link, image });
    });
    return posts.slice(0, 40);
  } catch { return []; }
}
export async function getSearchPosts({ searchQuery, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = BASE + "/search?q=" + encodeURIComponent(searchQuery);
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts: Post[] = [];
    $(".video-card a").each((_: any, el: any) => {
      const $el = $(el);
      let link = ($el.attr("href") || "").split("?")[0];
      if (!link) return;
      if (link.startsWith("/")) link = BASE + link;
      posts.push({ title: $el.attr("title") || "Result", link, image: "" });
    });
    return posts.slice(0, 30);
  } catch { return []; }
}
