import { Post, ProviderContext } from "../types";
const BASE = "https://xhamster2.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";
function abs(url: string): string {
  if (!url) return "";
  try { return new URL(url, BASE).href; } catch { return ""; }
}
function parseCards(html: string, cheerio: any): Post[] {
  const $ = cheerio.load(html);
  const result: Post[] = [];
  const seen = new Set<string>();
  $("a[href*='/videos/']").each((_: any, node: any) => {
    const a = $(node);
    const href = a.attr("href") || "";
    if (!/\/videos\/[^/?#]+-[a-z0-9]+/i.test(href)) return;
    const link = abs(href).split("?")[0];
    if (!link || seen.has(link)) return;
    const img = a.find("img").first();
    const title = a.attr("title") || img.attr("alt") || a.text().trim();
    const image = abs(img.attr("data-src") || img.attr("data-original") || img.attr("src") || "");
    if (!title) return;
    seen.add(link);
    result.push({ title: title.trim(), link, image });
  });
  return result;
}
export async function getPosts({ page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext as ProviderContext;
    const first = await axios.get(BASE + "/", { headers: { "User-Agent": UA }, signal, timeout: 25000 });
    let html = String(first.data || "");
    if (page > 1) {
      const $ = cheerio.load(html);
      let pageUrl = "";
      $("a.page-button-link").each((_: any, node: any) => {
        const a = $(node);
        const number = a.attr("data-page") || a.text().trim();
        if (number === String(page)) pageUrl = abs(a.attr("href") || "");
      });
      if (!pageUrl) return [];
      const response = await axios.get(pageUrl, { headers: { "User-Agent": UA, "Referer": BASE + "/" }, signal, timeout: 25000 });
      html = String(response.data || "");
    }
    return parseCards(html, cheerio);
  } catch { return []; }
}
export async function getSearchPosts({ searchQuery, page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext as ProviderContext;
    const url = BASE + "/search/" + encodeURIComponent(searchQuery) + "?page=" + page;
    const response = await axios.get(url, { headers: { "User-Agent": UA, "Referer": BASE + "/" }, signal, timeout: 25000 });
    return parseCards(String(response.data || ""), cheerio);
  } catch { return []; }
}
