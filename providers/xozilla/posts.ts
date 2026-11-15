import { Post, ProviderContext } from "../types";
const BASE = "https://www.xozilla.com";
const H = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36", Accept: "text/html", Referer: BASE + "/" };
export async function getPosts({ filter, page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    let url = BASE + "/";
    if (filter) url = BASE + "/" + filter.replace(/^\//, "") + "/";
    if (page > 1) url += (url.includes("?") ? "&" : "?") + "page=" + page;
    const res = await axios.get(url, { headers: H, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const seen = new Set<string>();
    const posts: Post[] = [];
    $("a[href*='/video'], a[href*='/videos/'], a[href*='/v/']").each((_: any, el: any) => {
      let link = ($(el).attr("href") || "").trim();
      if (!link) return;
      if (link.startsWith("//")) link = "https:" + link;
      else if (link.startsWith("/")) link = BASE + link;
      if (!/\/(video|videos|v)\//.test(link) || seen.has(link)) return;
      if (/\/(categories|tags|models|channels|search)\//i.test(link)) return;
      const title = ($(el).attr("title") || $(el).find("img").attr("alt") || $(el).text() || "Untitled").trim();
      let image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || "";
      if (image.startsWith("//")) image = "https:" + image;
      seen.add(link);
      posts.push({ title, link, image });
    });
    return posts.slice(0, 80);
  } catch { return []; }
}
export async function getSearchPosts({ searchQuery, page = 1, signal, providerContext }: any): Promise<Post[]> {
  return getPosts({ filter: "search/" + encodeURIComponent(searchQuery), page, signal, providerContext });
}
