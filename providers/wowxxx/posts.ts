import { Post, ProviderContext } from "../types";

const BASE = "https://www.wowxxx.to";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export async function getPosts({ page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = page > 1 ? `${BASE}/?page=${page}` : BASE;
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 25000 });
    const $ = cheerio.load(res.data || "");
    const posts: Post[] = [];
    const seen = new Set<string>();

    $(".item").each((_: any, el: any) => {
      const $el = $(el);
      const $a = $el.find("a.thumb_img, a.thumb_title").first();
      let link = $a.attr("href") || "";
      if (!link || seen.has(link)) return;
      if (link.startsWith("/")) link = BASE + link;
      if (!link.includes("/videos/")) return;
      seen.add(link);

      const title =
        $el.find(".title").first().text().trim() ||
        $a.attr("title") ||
        $el.find("img").attr("alt") ||
        "Video";
      const image =
        $el.find("img.thumb").attr("data-src") ||
        $el.find("img").attr("data-src") ||
        $el.find("img").attr("src") ||
        "";

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
    const url = `${BASE}/search/?q=${encodeURIComponent(searchQuery)}&page=${page}`;
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 25000 });
    const $ = cheerio.load(res.data || "");
    const posts: Post[] = [];
    const seen = new Set<string>();

    $(".item").each((_: any, el: any) => {
      const $el = $(el);
      const $a = $el.find("a.thumb_img, a.thumb_title").first();
      let link = $a.attr("href") || "";
      if (!link || seen.has(link)) return;
      if (link.startsWith("/")) link = BASE + link;
      if (!link.includes("/videos/")) return;
      seen.add(link);

      const title = $el.find(".title").first().text().trim() || $a.attr("title") || "Result";
      const image = $el.find("img.thumb").attr("data-src") || $el.find("img").attr("src") || "";
      if (title && link) posts.push({ title, link, image });
    });
    return posts.slice(0, 30);
  } catch {
    return [];
  }
}
