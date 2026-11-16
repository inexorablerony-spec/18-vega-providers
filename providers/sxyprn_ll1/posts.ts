import { Post, ProviderContext } from "../types";
const BASE = "https://sxyprn.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

export async function getPosts({ page = 1, filter, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const isTopSeeded = filter === "top" || filter === "Top Seeded";
    if (isTopSeeded) {
      const res = await axios.get("https://myporn.club/ts/hits/week", { headers: { "User-Agent": UA }, signal, timeout: 20000 });
      const $ = cheerio.load(res.data || "");
      const posts: Post[] = [];
      $("a[href*='/t/']").each((_: any, el: any) => {
        const $el = $(el);
        const href = $el.attr("href") || "";
        if (!href.includes("/t/")) return;
        const title = $el.attr("title") || $el.text().trim() || "Video";
        const torrentId = href.match(/\/t\/([a-zA-Z0-9]+)/)?.[1] || "";
        if (torrentId && !posts.find(p => p.link.includes(torrentId))) {
          posts.push({ title: title.slice(0, 60), link: `https://myporn.club/t/${torrentId}`, image: "" });
        }
      });
      return posts.slice(0, 20);
    }
    const url = `${BASE}/trending.html?page=${page || 1}`;
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts: Post[] = [];
    $("a[href*='/post/']").each((_: any, el: any) => {
      const $el = $(el);
      const link = $el.attr("href");
      if (!link || !link.includes("/post/")) return;
      const title = $el.attr("aria-label") || $el.attr("title") || "Video";
      let image = $el.find("img").attr("data-src") || $el.find("img").attr("src") || "";
      if (image && image.startsWith("//")) image = "https:" + image;
      if (image && image.startsWith("/")) image = BASE + image;
      const fullLink = link.startsWith("http") ? link : BASE + link.split("?")[0];
      if (!posts.find(p => p.link === fullLink)) {
        posts.push({ title: title.replace(/\s*video$/i, "").trim(), link: fullLink, image });
      }
    });
    return posts.slice(0, 30);
  } catch { return []; }
}

export async function getSearchPosts({ searchQuery, page = 1, signal, providerContext }: any): Promise<Post[]> {
  try {
    const { axios, cheerio } = providerContext;
    const url = `${BASE}/search.html?q=${encodeURIComponent(searchQuery)}&page=${page}`;
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts: Post[] = [];
    $("a[href*='/post/']").each((_: any, el: any) => {
      const $el = $(el);
      const link = $el.attr("href");
      if (!link) return;
      const title = $el.attr("aria-label") || $el.attr("title") || "Result";
      let image = $el.find("img").attr("data-src") || $el.find("img").attr("src") || "";
      if (image && image.startsWith("//")) image = "https:" + image;
      posts.push({ title, link: link.startsWith("http") ? link : BASE + link.split("?")[0], image });
    });
    return posts.slice(0, 30);
  } catch { return []; }
}
