import { Post, ProviderContext } from "../types";

const BASE = "https://hellporno.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

function parseHtml(html: string, cheerio: any): Post[] {
  const $ = cheerio.load(html || "");
  const posts: Post[] = [];
  const seen = new Set<string>();

  $(".video-thumb").each((_: any, el: any) => {
    const $el = $(el);
    const $link = $el.find("a.title").first();
    const link = $link.attr("href") || "";
    if (!link || !link.includes("/videos/") || seen.has(link)) return;
    
    const fullLink = link.startsWith("http") ? link : BASE + link;
    seen.add(fullLink);

    const title = $link.text().trim() || $el.find("img").attr("alt") || "Video";
    
    // Image from poster or img src
    let image = $el.find("video").attr("poster") || $el.find("img").attr("src") || "";
    if (image && image.startsWith("//")) image = "https:" + image;

    if (title && title.length > 3) {
      posts.push({ title, link: fullLink, image });
    }
  });

  return posts.slice(0, 30);
}

export async function getPosts({ page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = page > 1 ? `${BASE}/?page=${page}` : `${BASE}/`;
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 20000 });
    return parseHtml(res.data, cheerio);
  } catch { return []; }
}

export async function getSearchPosts({ searchQuery, page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const q = encodeURIComponent(searchQuery).replace(/%20/g, "-");
    const url = `${BASE}/search/${q}/${page > 1 ? `?page=${page}` : ""}`;
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 20000 });
    return parseHtml(res.data, cheerio);
  } catch { return []; }
}
