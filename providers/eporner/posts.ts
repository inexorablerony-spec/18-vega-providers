import { Post, ProviderContext } from "../types";

const BASE = "https://www.eporner.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function parseHtml(html: string, cheerio: any): Promise<Post[]> {
  const $ = cheerio.load(html || "");
  const posts: Post[] = [];
  const seen = new Set<string>();

  $(".mb").each((_: any, el: any) => {
    const $el = $(el);
    const $a = $el.find("a[href*='/video-']").first();
    let link = $a.attr("href") || "";
    if (!link || seen.has(link)) return;
    if (link.startsWith("/")) link = BASE + link;
    if (!link.includes("/video-")) return;
    seen.add(link);

    const title =
      $el.find(".mbtit a").first().text().trim() ||
      $el.find("img").attr("alt") ||
      "Video";
    const image = $el.find(".mbimg img").attr("src") || $el.find("img").attr("src") || "";

    if (title && link) posts.push({ title, link, image });
  });
  return posts;
}

export async function getPosts({ page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;

    try {
      const apiUrl = `${BASE}/api/v2/video/search/?order=latest&per_page=30&page=${page}`;
      const res = await axios.get(apiUrl, {
        headers: { "User-Agent": UA, Accept: "application/json" },
        signal,
        timeout: 15000,
      });
      let data = res.data;
      if (typeof data === "string") {
        try { data = JSON.parse(data); } catch { data = null; }
      }
      const videos = (data && data.videos) || [];
      if (videos.length) {
        return videos.map((v: any) => ({
          title: v.title || "Untitled",
          link: v.url || `${BASE}/video-${v.id}/`,
          image: (v.default_thumb && v.default_thumb.src) || "",
        }));
      }
    } catch {}

    const url = page > 1 ? `${BASE}/page/${page}/` : BASE;
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 25000 });
    return await parseHtml(res.data, cheerio);
  } catch {
    return [];
  }
}

export async function getSearchPosts({ searchQuery, page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;

    try {
      const apiUrl = `${BASE}/api/v2/video/search/?query=${encodeURIComponent(searchQuery)}&per_page=30&page=${page}`;
      const res = await axios.get(apiUrl, {
        headers: { "User-Agent": UA, Accept: "application/json" },
        signal,
        timeout: 15000,
      });
      let data = res.data;
      if (typeof data === "string") {
        try { data = JSON.parse(data); } catch { data = null; }
      }
      const videos = (data && data.videos) || [];
      if (videos.length) {
        return videos.map((v: any) => ({
          title: v.title || "Untitled",
          link: v.url || `${BASE}/video-${v.id}/`,
          image: (v.default_thumb && v.default_thumb.src) || "",
        }));
      }
    } catch {}

    const url = `${BASE}/search/${encodeURIComponent(searchQuery)}/${page}/`;
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 25000 });
    return await parseHtml(res.data, cheerio);
  } catch {
    return [];
  }
}
