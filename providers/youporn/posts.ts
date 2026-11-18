import { Post, ProviderContext } from "../types";

const BASE = "https://www.youporn.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function parseHtml(html: string, cheerio: any): Promise<Post[]> {
  const $ = cheerio.load(html || "");
  const posts: Post[] = [];
  const seen = new Set<string>();

  $("article.video-box").each((_: any, el: any) => {
    const $el = $(el);
    const $link = $el.find("a[href*='/watch/']").first();
    const link = $link.attr("href");
    if (!link || !link.includes("/watch/") || link.includes("/watch-history")) return;
    
    const fullLink = link.startsWith("http") ? link : BASE + link;
    if (seen.has(fullLink)) return;
    seen.add(fullLink);

    // Title from aria-label on article, or alt on img, or title attribute
    const title = $el.attr("aria-label") || 
                  $el.find("img").attr("alt") || 
                  $link.attr("title") || 
                  "Video";

    // Image from data-src (lazy loaded) or src
    let image = $el.find("img").attr("data-src") || 
                $el.find("img").attr("data-poster") ||
                $el.find("img").attr("src") || "";
    if (image && image.startsWith("//")) image = "https:" + image;
    if (image && image.startsWith("/")) image = BASE + image;
    // Skip placeholder images
    if (image.includes("data:image")) image = $el.find("img").attr("data-src") || "";

    if (title && title.length > 3 && title !== "Video") {
      posts.push({ title, link: fullLink, image });
    }
  });

  return posts.slice(0, 30);
}

export async function getPosts({ page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = page > 1 ? `${BASE}/?page=${page}` : `${BASE}/`;
    const res = await axios.get(url, { 
      headers: { 
        "User-Agent": UA,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      }, 
      signal, 
      timeout: 25000 
    });
    return await parseHtml(res.data, cheerio);
  } catch (e) { 
    console.error("YouPorn getPosts error:", e);
    return []; 
  }
}

export async function getSearchPosts({ searchQuery, page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = `${BASE}/search/?query=${encodeURIComponent(searchQuery)}&page=${page || 1}`;
    const res = await axios.get(url, { 
      headers: { 
        "User-Agent": UA,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      }, 
      signal, 
      timeout: 25000 
    });
    return await parseHtml(res.data, cheerio);
  } catch (e) { 
    console.error("YouPorn getSearchPosts error:", e);
    return []; 
  }
}
