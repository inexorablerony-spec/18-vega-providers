import { Post, ProviderContext } from "../types";

const BASE = "https://hellporno.com";
const H = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  Accept: "text/html",
};

function parse(html: string, cheerio: any): Post[] {
  const $ = cheerio.load(html || "");
  const posts: Post[] = [];
  const seen = new Set<string>();

  $("a[href*='/videos/']").each((_: any, el: any) => {
    let link = ($(el).attr("href") || "").trim();
    if (!link || seen.has(link)) return;
    if (link.startsWith("//")) link = "https:" + link;
    else if (link.startsWith("/")) link = BASE + link;
    if (!link.includes("/videos/")) return;
    seen.add(link);

    const title = ($(el).attr("title") || $(el).find("img").attr("alt") || "Untitled").trim().slice(0, 120);
    let image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || "";
    if (image.startsWith("//")) image = "https:" + image;

    if (title.length > 2) posts.push({ title, link, image });
  });

  return posts.slice(0, 50);
}

export async function getPosts({ page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = page > 1 ? `${BASE}/?page=${page}` : `${BASE}/`;
    const res = await axios.get(url, { headers: H, signal, timeout: 20000 });
    if (String(res.data || "").includes("Just a moment") || String(res.data || "").includes("challenge-platform")) {
      return [];
    }
    return parse(res.data, cheerio);
  } catch {
    return [];
  }
}

export async function getSearchPosts({ searchQuery, page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const q = encodeURIComponent(searchQuery).replace(/%20/g, "-");
    const url = `${BASE}/search/${q}/${page > 1 ? `?page=${page}` : ""}`;
    const res = await axios.get(url, { headers: H, signal, timeout: 20000 });
    if (String(res.data || "").includes("Just a moment") || String(res.data || "").includes("challenge-platform")) {
      return [];
    }
    return parse(res.data, cheerio);
  } catch {
    return [];
  }
}
