import { Post, ProviderContext } from "../types";
const BASE = "https://hqporner.com";
const H = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36", Accept: "text/html" };
export async function getPosts({ filter, page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    let url = BASE + "/";
    if (filter) url = BASE + "/" + filter;
    if (page > 1) url += (url.includes("?") ? "&" : "?") + "p=" + page;
    const res = await axios.get(url, { headers: H, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts: Post[] = [];
    $("section.box.feature, a[href*='/hdporn/']").each((_: any, el: any) => {
      const a = $(el).is("a") ? $(el) : $(el).find('a[href*="/hdporn/"]').first();
      let link = (a.attr("href") || "").trim();
      if (!link || !link.includes("/hdporn/")) return;
      if (link.startsWith("/")) link = BASE + link;
      const title = ($(el).find("h3 a").text() || a.attr("title") || a.text() || "Untitled").trim().slice(0, 120);
      let image = a.find("img").attr("src") || "";
      if (image.startsWith("//")) image = "https:" + image;
      if (title.length > 2) posts.push({ title, link, image });
    });
    return posts.slice(0, 50);
  } catch { return []; }
}
export async function getSearchPosts({ searchQuery, page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = BASE + "/?q=" + encodeURIComponent(searchQuery) + (page > 1 ? "&p=" + page : "");
    const res = await axios.get(url, { headers: H, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts: Post[] = [];
    const seen = new Set<string>();
    $("a[href*='/hdporn/']").each((_: any, el: any) => {
      let link = ($(el).attr("href") || "").trim();
      if (!link || seen.has(link)) return;
      seen.add(link);
      if (link.startsWith("/")) link = BASE + link;
      const title = ($(el).attr("title") || $(el).text() || "Untitled").trim();
      let image = $(el).find("img").attr("src") || "";
      if (image.startsWith("//")) image = "https:" + image;
      posts.push({ title, link, image });
    });
    return posts.slice(0, 50);
  } catch { return []; }
}
