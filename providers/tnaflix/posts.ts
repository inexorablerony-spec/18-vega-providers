import { Post, ProviderContext } from "../types";
const BASE = "https://www.tnaflix.com";
const H = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36", Accept: "text/html" };
export async function getPosts({ filter, page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    let url = BASE + "/";
    if (filter === "toprated") url = BASE + "/toprated";
    if (page > 1) url += (url.includes("?") ? "&" : "?") + "page=" + page;
    const res = await axios.get(url, { headers: H, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts: Post[] = [];
    $("a.video-thumb").each((_: any, el: any) => {
      let link = ($(el).attr("href") || "").trim();
      if (!link) return;
      if (link.startsWith("/")) link = BASE + link;
      const title = $(el).find("img").attr("alt") || "Untitled";
      let image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || "";
      if (image.startsWith("//")) image = "https:" + image;
      posts.push({ title, link, image });
    });
    return posts.slice(0, 60);
  } catch { return []; }
}
export async function getSearchPosts({ searchQuery, page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = BASE + "/search.php?what=" + encodeURIComponent(searchQuery) + (page > 1 ? "&page=" + page : "");
    const res = await axios.get(url, { headers: H, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts: Post[] = [];
    $("a.video-thumb").each((_: any, el: any) => {
      let link = ($(el).attr("href") || "").trim();
      if (!link) return;
      if (link.startsWith("/")) link = BASE + link;
      const title = $(el).find("img").attr("alt") || "Untitled";
      let image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || "";
      if (image.startsWith("//")) image = "https:" + image;
      posts.push({ title, link, image });
    });
    return posts.slice(0, 60);
  } catch { return []; }
}
