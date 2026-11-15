import { Post, ProviderContext } from "../types";
const BASE = "https://www.xvideos.com";
const H = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36", Accept: "text/html" };
export async function getPosts({ filter, page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = page > 1 ? BASE + "/new/" + page : BASE + "/";
    const res = await axios.get(url, { headers: H, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts: Post[] = [];
    $(".thumb-block").each((_: any, el: any) => {
      const a = $(el).find("a").first();
      let link = (a.attr("href") || "").trim();
      if (!link.includes("/video")) return;
      if (link.startsWith("/")) link = BASE + link;
      const title = $(el).find(".title").text().trim() || "Untitled";
      let image = a.find("img").attr("data-src") || a.find("img").attr("src") || "";
      if (image.startsWith("//")) image = "https:" + image;
      posts.push({ title, link, image });
    });
    return posts.slice(0, 60);
  } catch { return []; }
}
export async function getSearchPosts({ searchQuery, page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = BASE + "/?k=" + encodeURIComponent(searchQuery) + (page > 1 ? "&p=" + page : "");
    const res = await axios.get(url, { headers: H, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts: Post[] = [];
    $(".thumb-block").each((_: any, el: any) => {
      const a = $(el).find("a").first();
      let link = (a.attr("href") || "").trim();
      if (!link.includes("/video")) return;
      if (link.startsWith("/")) link = BASE + link;
      const title = $(el).find(".title").text().trim() || "Untitled";
      let image = a.find("img").attr("data-src") || a.find("img").attr("src") || "";
      if (image.startsWith("//")) image = "https:" + image;
      posts.push({ title, link, image });
    });
    return posts.slice(0, 60);
  } catch { return []; }
}
