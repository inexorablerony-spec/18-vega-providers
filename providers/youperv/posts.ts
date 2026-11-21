import { Post, ProviderContext } from "../types";
const BASE = "https://youperv.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

function parse(html: string, cheerio: any): Post[] {
  const $ = cheerio.load(html || "");
  const posts: Post[] = [];
  const seen = new Set<string>();
  $(".item-link, a[href*='.html']").each((_: any, el: any) => {
    const $el = $(el);
    let link = ($el.attr("href") || "").split("?")[0];
    if (!link || !/\d{7,}/.test(link) || link.includes("/top-")) return;
    if (link.startsWith("/")) link = BASE + link;
    if (seen.has(link)) return;
    seen.add(link);
    const title = $el.attr("title") || $el.find(".item-title").text().trim() || $el.find("img").attr("alt") || $el.text().trim() || "Video";
    let image = $el.find("img").attr("data-src") || $el.find("img").attr("src") || $el.closest(".item").find("img").attr("src") || "";
    if (image.startsWith("//")) image = "https:" + image;
    else if (image.startsWith("/")) image = BASE + image;
    if (title.length > 2) posts.push({ title: title.trim().slice(0, 140), link, image });
  });
  return posts.slice(0, 40);
}

export async function getPosts({ page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = BASE + (page > 1 ? "/page/" + page + "/" : "/");
    const res = await axios.get(url, { headers: { "User-Agent": UA, Referer: BASE + "/" }, signal, timeout: 20000 });
    return parse(res.data, cheerio);
  } catch { return []; }
}
export async function getSearchPosts({ searchQuery, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = BASE + "/search/" + encodeURIComponent(searchQuery).replace(/%20/g, "-") + ".html";
    const res = await axios.get(url, { headers: { "User-Agent": UA, Referer: BASE + "/" }, signal, timeout: 20000 });
    return parse(res.data, cheerio);
  } catch { return []; }
}
