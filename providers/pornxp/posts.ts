import { Post, ProviderContext } from "../types";

const BASE = "https://pxp.pink";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export async function getPosts({ page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = page > 1 ? `${BASE}/?page=${page}` : BASE;
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 25000 });
    const $ = cheerio.load(res.data || "");
    const posts: Post[] = [];
    const seen = new Set<string>();

    $(".item_cont").each((_: any, el: any) => {
      const $el = $(el);
      const $a = $el.find("a[href*='/videos/']").first();
      let link = $a.attr("href") || "";
      if (!link || seen.has(link)) return;
      if (link.startsWith("/")) link = BASE + link;
      seen.add(link);

      const title = $el.find(".item_title").first().text().trim() || $a.attr("title") || "Video";
      let image = $el.find(".item_img").attr("data-src") || $el.find(".item_img").attr("src") || "";
      if (image && image.startsWith("/")) image = BASE + image;

      if (title && link) posts.push({ title, link, image });
    });
    return posts.slice(0, 30);
  } catch {
    return [];
  }
}

export async function getSearchPosts({ searchQuery, page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = `${BASE}/?q=${encodeURIComponent(searchQuery)}&page=${page}`;
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 25000 });
    const $ = cheerio.load(res.data || "");
    const posts: Post[] = [];
    const seen = new Set<string>();

    $(".item_cont").each((_: any, el: any) => {
      const $el = $(el);
      const $a = $el.find("a[href*='/videos/']").first();
      let link = $a.attr("href") || "";
      if (!link || seen.has(link)) return;
      if (link.startsWith("/")) link = BASE + link;
      seen.add(link);

      const title = $el.find(".item_title").first().text().trim() || "Result";
      let image = $el.find(".item_img").attr("data-src") || $el.find(".item_img").attr("src") || "";
      if (image && image.startsWith("/")) image = BASE + image;
      if (title && link) posts.push({ title, link, image });
    });
    return posts.slice(0, 30);
  } catch {
    return [];
  }
}
