import { Post, ProviderContext } from "../types";

const BASE = "https://sxyprn.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

function parsePosts(html: string, cheerio: any): Post[] {
  const $ = cheerio.load(html || "");
  const posts: Post[] = [];
  const seen = new Set<string>();

  $("a[href*='/post/']").each((_: any, el: any) => {
    const $el = $(el);
    let link = ($el.attr("href") || "").split("?")[0];
    if (!link || !link.includes("/post/")) return;
    if (link.startsWith("/")) link = BASE + link;
    if (seen.has(link)) return;
    seen.add(link);

    const title =
      $el.attr("aria-label") ||
      $el.attr("title") ||
      $el.find(".post_time").attr("title") ||
      $el.text().trim() ||
      "Video";

    let image = $el.find("img").attr("data-src") || $el.find("img").attr("src") || "";
    if (image.startsWith("//")) image = "https:" + image;
    else if (image.startsWith("/")) image = BASE + image;

    if (title.length > 2) posts.push({ title: title.trim().slice(0, 140), link, image });
  });

  return posts.slice(0, 40);
}

export async function getPosts({ page = 1, filter, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const f = (filter || "trending").toLowerCase();
    const path =
      f === "new" ? "/new.html" :
      f === "latest" ? "/latest.html" :
      f === "popular" ? "/popular.html" :
      f === "top" ? "/top.html" :
      "/trending.html";
    const url = `${BASE}${path}?page=${page || 1}`;
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 20000 });
    return parsePosts(res.data, cheerio);
  } catch {
    return [];
  }
}

export async function getSearchPosts({ searchQuery, page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = `${BASE}/search.html?q=${encodeURIComponent(searchQuery)}&page=${page || 1}`;
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 20000 });
    return parsePosts(res.data, cheerio);
  } catch {
    return [];
  }
}
