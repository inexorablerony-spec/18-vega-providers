import { Post, ProviderContext } from "../types";
const BASE = "https://pxp.pink";
const UA = "Mozilla/5.0";

export async function getPosts({ page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = `${BASE}/videos`;
    const res = await axios.get(url, { params: { page }, headers: { "User-Agent": UA }, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts: Post[] = [];
    $("a[href*='/videos/']").each((_: any, el: any) => {
      const link = $(el).attr("href");
      const title = $(el).attr("title") || $(el).find("img").attr("alt") || $(el).text().trim() || "Video";
      const image = $(el).find("img").attr("src") || "";
      if (link && title) posts.push({ title, link: link.startsWith("http") ? link : BASE + link, image });
    });
    return posts.slice(0, 30);
  } catch (error: any) { throw new Error(`Listing request failed: ${error?.response?.status || error?.message || String(error)}`); }
}

export async function getSearchPosts({ searchQuery, page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = `${BASE}/search?q=${encodeURIComponent(searchQuery)}`;
    const res = await axios.get(url, { params: { page }, headers: { "User-Agent": UA }, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts: Post[] = [];
    $("a[href*='/videos/']").each((_: any, el: any) => {
      const link = $(el).attr("href");
      const title = $(el).attr("title") || $(el).find("img").attr("alt") || "Result";
      const image = $(el).find("img").attr("src") || "";
      if (link) posts.push({ title, link: link.startsWith("http") ? link : BASE + link, image });
    });
    return posts.slice(0, 30);
  } catch (error: any) { throw new Error(`Listing request failed: ${error?.response?.status || error?.message || String(error)}`); }
}
