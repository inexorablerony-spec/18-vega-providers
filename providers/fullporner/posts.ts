import { Post, ProviderContext } from "../types";

const BASE = "https://fullporner.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

function parse(html: string, cheerio: any): Post[] {
  const $ = cheerio.load(html || "");
  const posts: Post[] = [];
  const seen = new Set<string>();
  $(".video-card").each((_: any, el: any) => {
    const $card = $(el);
    const $a = $card.find("a[href^='/watch/']").first();
    let link = ($a.attr("href") || "").split("?")[0];
    if (!link) return;
    link = BASE + link;
    if (seen.has(link)) return;
    seen.add(link);
    const title = $a.find("img").attr("alt") || $card.find(".video-title").text().trim() || "Video";
    let image = $a.find("img").attr("data-src") || $a.find("img").attr("src") || "";
    if (image.startsWith("//")) image = "https:" + image;
    if (title.length > 2) posts.push({ title: title.trim().slice(0, 140), link, image });
  });
  return posts.slice(0, 40);
}

export async function getPosts({ page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = page > 1 ? `${BASE}/home/${page}` : `${BASE}/`;
    const res = await axios.get(url, { headers: { "User-Agent": UA, Referer: BASE + "/" }, signal, timeout: 20000 });
    return parse(res.data, cheerio);
  } catch { return []; }
}

export async function getSearchPosts({ searchQuery, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = `${BASE}/search?q=${encodeURIComponent(searchQuery)}`;
    const res = await axios.get(url, { headers: { "User-Agent": UA, Referer: BASE + "/" }, signal, timeout: 20000 });
    return parse(res.data, cheerio);
  } catch { return []; }
}
