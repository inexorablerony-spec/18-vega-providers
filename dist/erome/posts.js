// @vega-provider erome
// @vega-version 1.0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchPosts = exports.getPosts = void 0;
const getPosts = async function ({ filter, page = 1, signal, providerContext }) {
  try {
    const { axios, cheerio } = providerContext;
    const BASE = "https://www.erome.com";
    const H = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36", Accept: "text/html" };
    const url = BASE + "/explore" + (page > 1 ? "?page=" + page : "");
    const res = await axios.get(url, { headers: H, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts = [];
    const seen = new Set();
    $("a.album-link, div.album a, a[href*='/a/']").each((_, el) => {
      let link = ($(el).attr("href") || "").trim();
      if (!link || !link.includes("/a/")) return;
      if (link.startsWith("/")) link = BASE + link;
      if (seen.has(link)) return;
      seen.add(link);
      const title = ($(el).attr("title") || $(el).find("img").attr("alt") || $(el).text() || "Album").trim().slice(0, 100);
      let image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || "";
      if (image.startsWith("//")) image = "https:" + image;
      posts.push({ title: title || "Album", link, image });
    });
    return posts.slice(0, 50);
  } catch { return []; }
};
exports.getPosts = getPosts;
const getSearchPosts = async function ({ searchQuery, page = 1, signal, providerContext }) {
  return getPosts({ filter: "", page, signal, providerContext });
};
exports.getSearchPosts = getSearchPosts;
