import { Post, ProviderContext } from "../types";
const BASE = "https://xhamster.one";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

export async function getPosts({ page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = page > 1 ? `${BASE}/?page=${page}` : `${BASE}/`;
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts: Post[] = [];
    const seen = new Set<string>();
    $(".th").each((_: any, el: any) => {
      const $el = $(el);
      const $link = $el.find("a").first();
      const link = $link.attr("href");
      if (!link || !link.includes("/videos/")) return;
      const fullLink = link.startsWith("http") ? link : BASE + link;
      if (seen.has(fullLink)) return;
      seen.add(fullLink);
      const title = $link.attr("title") || $el.find(".tx").text().trim() || "Video";
      let image = $el.find("img").attr("data-src") || $el.find("img").attr("src") || "";
      if (image && image.startsWith("/")) image = BASE + image;
      if (title) posts.push({ title, link: fullLink, image });
    });
    return posts.slice(0, 30);
  } catch { return []; }
}

export async function getSearchPosts({ searchQuery, page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const q = encodeURIComponent(searchQuery);
    const url = page > 1 ? `${BASE}/search/${q}/${page}` : `${BASE}/search/${q}`;
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts: Post[] = [];
    const seen = new Set<string>();
    $(".th").each((_: any, el: any) => {
      const $el = $(el);
      const $link = $el.find("a").first();
      const link = $link.attr("href");
      if (!link || !link.includes("/videos/")) return;
      const fullLink = link.startsWith("http") ? link : BASE + link;
      if (seen.has(fullLink)) return;
      seen.add(fullLink);
      const title = $link.attr("title") || $el.find(".tx").text().trim() || "Result";
      let image = $el.find("img").attr("data-src") || $el.find("img").attr("src") || "";
      if (image && image.startsWith("/")) image = BASE + image;
      if (title) posts.push({ title, link: fullLink, image });
    });
    return posts.slice(0, 30);
  } catch { return []; }
}
