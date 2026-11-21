import { Post, ProviderContext } from "../types";

const BASE = "https://www.alphaporno.com";
const H = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  Accept: "text/html",
};

function parse(html: string, cheerio: any): Post[] {
  const $ = cheerio.load(html || "");
  const posts: Post[] = [];
  const seen = new Set<string>();

  $("li.thumb").each((_: any, el: any) => {
    const $a = $(el).find("a").first();
    let link = ($a.attr("href") || "").trim();
    if (!link || !link.includes("/videos/")) return;

    if (link.startsWith("/")) link = BASE + link;
    else if (link.startsWith("//")) link = "https:" + link;

    if (seen.has(link)) return;
    seen.add(link);

    const title =
      $a.find("p[itemprop='name']").text().trim() ||
      $a.find("img").attr("alt")?.trim() ||
      "Untitled";

    let image = $a.find("img").attr("src") || $a.find("img").attr("data-src") || "";
    if (image.startsWith("//")) image = "https:" + image;

    if (title.length > 2) posts.push({ title, link, image });
  });

  return posts.slice(0, 40);
}

export async function getPosts({ page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = page > 1 ? `${BASE}/?page=${page}` : `${BASE}/`;
    const res = await axios.get(url, { headers: H, signal, timeout: 20000 });
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
    return parse(res.data, cheerio);
  } catch {
    return [];
  }
}
