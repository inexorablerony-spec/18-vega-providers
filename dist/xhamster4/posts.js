// @vega-provider xhamster4
// @vega-version 1.0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchPosts = exports.getPosts = void 0;
const getPosts = async function ({ page = 1, signal, providerContext }) {
  try {
    const { axios, cheerio } = providerContext;
    const BASE = "https://xhamster.com";
    const res = await axios.get(BASE + "/channels?page=" + page, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts = [];
    const seen = new Set();
    $("a[href*='/videos/']").each((_, el) => {
      let link = $(el).attr("href") || "";
      if (!link || !/\/videos\/[^/?#]+/i.test(link)) return;
      if (link.startsWith("/")) link = BASE + link;
      link = link.split("?")[0];
      if (seen.has(link)) return;
      seen.add(link);
      const title = $(el).attr("title") || $(el).find("img").attr("alt") || $(el).text().trim();
      let image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || "";
      if (image.startsWith("//")) image = "https:" + image;
      if (title && title.length > 2) posts.push({ title, link, image });
    });
    return posts.slice(0, 40);
  } catch { return []; }
};
exports.getPosts = getPosts;
const getSearchPosts = async function ({ searchQuery, page = 1, signal, providerContext }) {
  return [];
};
exports.getSearchPosts = getSearchPosts;
