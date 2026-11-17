import { Post, ProviderContext } from "../types";
const BASE = "https://desibabe.co";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

async function fetchPage(url: string, axios: any, cheerio: any, signal: any): Promise<Post[]> {
  const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 20000 });
  const $ = cheerio.load(res.data || "");
  const posts: Post[] = [];
  $("a[href*='/post/']").each((_: any, el: any) => {
    const $el = $(el);
    const link = $el.attr("href");
    if (!link || !link.includes("/post/")) return;
    const fullLink = link.startsWith("http") ? link : BASE + link;
    const title = $el.find("img").attr("alt") || $el.text().trim() || "Video";
    let image = $el.find("img").attr("src") || "";
    if (image && image.includes("url=")) {
      const match = image.match(/url=([^&]+)/);
      if (match) image = decodeURIComponent(match[1]);
    }
    if (title) posts.push({ title, link: fullLink, image });
  });
  return posts;
}

export async function getPosts({ page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = page > 1 ? `${BASE}/page/${page}` : `${BASE}/`;
    const posts = await fetchPage(url, axios, cheerio, signal);
    const seen = new Set<string>();
    return posts.filter(p => {
      if (seen.has(p.link)) return false;
      seen.add(p.link);
      return true;
    }).slice(0, 30);
  } catch { return []; }
}

export async function getSearchPosts({ searchQuery, page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const allPosts: Post[] = [];
    const seen = new Set<string>();
    const maxPages = 20;
    const startPage = ((page || 1) - 1) * 5 + 1;
    const endPage = startPage + 5;
    for (let p = startPage; p < endPage && p <= maxPages; p++) {
      const url = p > 1 ? `${BASE}/page/${p}` : `${BASE}/`;
      const posts = await fetchPage(url, axios, cheerio, signal);
      for (const post of posts) {
        if (!seen.has(post.link)) {
          seen.add(post.link);
          allPosts.push(post);
        }
      }
    }
    const query = searchQuery.toLowerCase();
    const filtered = allPosts.filter(p => p.title.toLowerCase().includes(query));
    return filtered.slice(0, 30);
  } catch { return []; }
}
