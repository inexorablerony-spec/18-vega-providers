import { Post, ProviderContext } from "../types";
const BASE = "https://www.eporner.com";
export async function getPosts({ page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios } = providerContext;
    const url = BASE + "/api/v2/video/search/?order=latest&per_page=30&page=" + page;
    const res = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" }, signal, timeout: 20000 });
    let data = res.data;
    if (typeof data === "string") { try { data = JSON.parse(data); } catch { return []; } }
    const videos = (data && data.videos) || [];
    return videos.map((v: any) => ({
      title: v.title || "Untitled",
      link: v.url || (BASE + "/video-" + v.id + "/"),
      image: (v.default_thumb && v.default_thumb.src) || "",
    }));
  } catch { return []; }
}
export async function getSearchPosts({ searchQuery, page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios } = providerContext;
    const url = BASE + "/api/v2/video/search/?query=" + encodeURIComponent(searchQuery) + "&per_page=30&page=" + page;
    const res = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" }, signal, timeout: 20000 });
    let data = res.data;
    if (typeof data === "string") { try { data = JSON.parse(data); } catch { return []; } }
    const videos = (data && data.videos) || [];
    return videos.map((v: any) => ({
      title: v.title || "Untitled",
      link: v.url || (BASE + "/video-" + v.id + "/"),
      image: (v.default_thumb && v.default_thumb.src) || "",
    }));
  } catch { return []; }
}
