import { Post, ProviderContext } from "../types";
const BASE = "https://sxyprn.com";
const H = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36", Accept: "text/html" };
export async function getPosts({ filter, page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = BASE + "/new.html" + (page > 1 ? "?page=" + page : "");
    const res = await axios.get(url, { headers: H, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts: Post[] = [];
    $("a[href*='/post/']").each((_: any, el: any) => {
      let link = ($(el).attr("href") || "").trim();
      if (!link.includes("/post/") || link.includes("?")) return;
      if (link.startsWith("/")) link = BASE + link;
      const title = ($(el).attr("title") || $(el).text() || "Untitled").trim().slice(0, 120);
      let image = $(el).closest(".post_el_small, .post_el").find("img").attr("data-src") || $(el).find("img").attr("src") || "";
      if (image.startsWith("//")) image = "https:" + image;
      if (title.length > 3) posts.push({ title, link, image });
    });
    return posts.slice(0, 40);
  } catch { return []; }
}
export async function getSearchPosts({ searchQuery, page = 1, signal, providerContext }: any): Promise<Post[]> {
  return getPosts({ filter: "", page, signal, providerContext });
}
