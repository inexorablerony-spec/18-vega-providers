import { Post, ProviderContext } from "../types";
const BASE = "https://pxp.pink";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

export async function getPosts({ page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = page > 1 ? `${BASE}/?page=${page}` : BASE;
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts: Post[] = [];
    $(".video, .item, .thumb, article").each((_: any, el: any) => {
      const $el = $(el);
      const $a = $el.find("a[href]").first();
      let link = $a.attr("href") || "";
      if (link.startsWith("/")) link = BASE + link;
      const title = $el.find(".title, h2, h3").first().text().trim() || $a.attr("title") || "Video";
      const image = $el.find("img").attr("data-src") || $el.find("img").attr("src") || "";
      if (link && title) posts.push({ title, link, image });
    });
    return posts.slice(0, 30);
  } catch { return []; }
}

export async function getSearchPosts({ searchQuery, page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = `${BASE}/search?q=${encodeURIComponent(searchQuery)}&page=${page}`;
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts: Post[] = [];
    $(".video, .item, .thumb").each((_: any, el: any) => {
      const $el = $(el);
      const $a = $el.find("a[href]").first();
      let link = $a.attr("href") || "";
      if (link.startsWith("/")) link = BASE + link;
      const title = $el.find(".title, h2").first().text().trim() || "Result";
      const image = $el.find("img").attr("src") || "";
      if (link) posts.push({ title, link, image });
    });
    return posts.slice(0, 30);
  } catch { return []; }
}
