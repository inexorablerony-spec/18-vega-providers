import { Post, ProviderContext } from "../types";
const BASE = "https://desibabe.co";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

export async function getPosts({ page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = page > 1 ? `${BASE}/page/${page}` : `${BASE}/`;
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts: Post[] = [];
    const seen = new Set<string>();
    $("a[href*='/post/']").each((_: any, el: any) => {
      const $el = $(el);
      const link = $el.attr("href");
      if (!link || !link.includes("/post/")) return;
      const fullLink = link.startsWith("http") ? link : BASE + link;
      if (seen.has(fullLink)) return;
      seen.add(fullLink);
      const title = $el.find("img").attr("alt") || $el.text().trim() || "Video";
      let image = $el.find("img").attr("src") || "";
      if (image && image.includes("url=")) {
        const match = image.match(/url=([^&]+)/);
        if (match) image = decodeURIComponent(match[1]);
      }
      if (title) posts.push({ title, link: fullLink, image });
    });
    return posts.slice(0, 30);
  } catch { return []; }
}

export async function getSearchPosts({ searchQuery, page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const allPosts: Post[] = [];
    const seen = new Set<string>();
    const maxPages = 5;
    for (let p = 1; p <= maxPages; p++) {
      const url = p > 1 ? `${BASE}/page/${p}` : `${BASE}/`;
      const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 20000 });
      const $ = cheerio.load(res.data || "");
      $("a[href*='/post/']").each((_: any, el: any) => {
        const $el = $(el);
        const link = $el.attr("href");
        if (!link || !link.includes("/post/")) return;
        const fullLink = link.startsWith("http") ? link : BASE + link;
        if (seen.has(fullLink)) return;
        seen.add(fullLink);
        const title = $el.find("img").attr("alt") || $el.text().trim() || "Video";
        let image = $el.find("img").attr("src") || "";
        if (image && image.includes("url=")) {
          const match = image.match(/url=([^&]+)/);
          if (match) image = decodeURIComponent(match[1]);
        }
        if (title) allPosts.push({ title, link: fullLink, image });
      });
    }
    const query = searchQuery.toLowerCase();
    const filtered = allPosts.filter(p => p.title.toLowerCase().includes(query));
    return filtered.slice(0, 30);
  } catch { return []; }
}
