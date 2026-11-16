import { Post, ProviderContext } from "../types";

const BASE = "https://noodlemagazine.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

function getImage($el: any): string {
  const img = $el.find("img").first();
  if (!img.length) return "";
  return (
    img.attr("data-src") ||
    img.attr("data-original") ||
    img.attr("data-lazy-src") ||
    img.attr("src") ||
    ""
  );
}

export async function getPosts({ page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = `${BASE}/home`;
    const res = await axios.get(url, { params: { page }, headers: { "User-Agent": UA }, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts: Post[] = [];
    $("a[href*='/watch/']").each((_: any, el: any) => {
      const $el = $(el);
      const link = $el.attr("href");
      const title = $el.attr("title") || $el.find("img").attr("alt") || $el.text().trim() || "Video";
      let image = getImage($el);
      if (image && image.startsWith("/")) image = BASE + image;
      if (image && image.startsWith("//")) image = "https:" + image;
      if (link && title) {
        posts.push({ title, link: link.startsWith("http") ? link : BASE + link, image });
      }
    });
    return posts.slice(0, 30);
  } catch { return []; }
}

export async function getSearchPosts({ searchQuery, page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = `${BASE}/search?q=${encodeURIComponent(searchQuery)}`;
    const res = await axios.get(url, { params: { page }, headers: { "User-Agent": UA }, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts: Post[] = [];
    $("a[href*='/watch/']").each((_: any, el: any) => {
      const $el = $(el);
      const link = $el.attr("href");
      const title = $el.attr("title") || $el.find("img").attr("alt") || "Result";
      let image = getImage($el);
      if (image && image.startsWith("/")) image = BASE + image;
      if (image && image.startsWith("//")) image = "https:" + image;
      if (link) posts.push({ title, link: link.startsWith("http") ? link : BASE + link, image });
    });
    return posts.slice(0, 30);
  } catch { return []; }
}
