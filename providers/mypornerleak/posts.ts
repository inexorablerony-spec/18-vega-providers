import { Post, ProviderContext } from "../types";
const BASE = "https://tv.mypornerleak.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

function parse(html: string, cheerio: any): Post[] {
  const $ = cheerio.load(html || "");
  const posts: Post[] = [];
  const seen = new Set<string>();
  $("a[href*='mypornerleak.com/']").each((_: any, el: any) => {
    const $el = $(el);
    let link = ($el.attr("href") || "").split("?")[0];
    if (!link || link === BASE + "/" || link.includes("/page/") || link.includes("/actors/") || link.includes("/category/") || link.includes("/tag/") || link.includes("/feed")) return;
    if (seen.has(link)) return;
    seen.add(link);
    const title = $el.attr("title") || $el.find("img").attr("alt") || $el.text().trim() || "Video";
    let image = $el.find("img").attr("src") || $el.find("img").attr("data-src") || "";
    if (image.startsWith("//")) image = "https:" + image;
    if (title.length > 5) posts.push({ title: title.trim().slice(0, 140), link, image });
  });
  return posts.slice(0, 40);
}

export async function getPosts({ page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = BASE + (page > 1 ? "/page/" + page + "/" : "/");
    const res = await axios.get(url, { headers: { "User-Agent": UA, Referer: BASE + "/" }, signal, timeout: 20000 });
    return parse(res.data, cheerio);
  } catch { return []; }
}
export async function getSearchPosts({ searchQuery, page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = BASE + "/?s=" + encodeURIComponent(searchQuery) + (page > 1 ? "&paged=" + page : "");
    const res = await axios.get(url, { headers: { "User-Agent": UA, Referer: BASE + "/" }, signal, timeout: 20000 });
    return parse(res.data, cheerio);
  } catch { return []; }
}
