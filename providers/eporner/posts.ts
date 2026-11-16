import { Post, ProviderContext } from "../types";

const BASE = "https://www.eporner.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function fromApi(axios: any, url: string, signal?: AbortSignal): Promise<Post[]> {
  try {
    const res = await axios.get(url, { headers: { "User-Agent": UA, Accept: "application/json" }, signal, timeout: 20000 });
    let data = res.data;
    if (typeof data === "string") { try { data = JSON.parse(data); } catch { return []; } }
    const videos = (data && data.videos) || [];
    return videos.map((v: any) => ({
      title: v.title || "Untitled",
      link: v.url || `${BASE}/video-${v.id}/`,
      image: (v.default_thumb && v.default_thumb.src) || "",
    }));
  } catch { return []; }
}

async function fromHtml(axios: any, cheerio: any, url: string, signal?: AbortSignal): Promise<Post[]> {
  try {
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 25000 });
    const $ = cheerio.load(res.data || "");
    const posts: Post[] = [];
    const seen = new Set<string>();
    $(".mb").each((_: any, el: any) => {
      const $el = $(el);
      const $a = $el.find("a[href*='/video-']").first();
      let link = $a.attr("href") || "";
      if (!link || seen.has(link)) return;
      if (link.startsWith("/")) link = BASE + link;
      seen.add(link);
      const title = $el.find(".mbtit a").first().text().trim() || $el.find("img").attr("alt") || "Video";
      const image = $el.find(".mbimg img").attr("src") || $el.find("img").attr("src") || "";
      if (title && link) posts.push({ title, link, image });
    });
    return posts.slice(0, 30);
  } catch { return []; }
}

export async function getPosts({ page = 1, signal, providerContext }: any): Promise<Post[]> {
  const { axios, cheerio } = providerContext;
  const apiPosts = await fromApi(axios, `${BASE}/api/v2/video/search/?order=latest&per_page=30&page=${page}`, signal);
  if (apiPosts.length) return apiPosts;
  return fromHtml(axios, cheerio, page > 1 ? `${BASE}/page/${page}/` : BASE, signal);
}

export async function getSearchPosts({ searchQuery, page = 1, signal, providerContext }: any): Promise<Post[]> {
  const { axios, cheerio } = providerContext;
  const apiPosts = await fromApi(axios, `${BASE}/api/v2/video/search/?query=${encodeURIComponent(searchQuery)}&per_page=30&page=${page}`, signal);
  if (apiPosts.length) return apiPosts;
  return fromHtml(axios, cheerio, `${BASE}/search/${encodeURIComponent(searchQuery)}/${page}/`, signal);
}
