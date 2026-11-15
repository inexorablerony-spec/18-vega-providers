// @vega-provider xhamster
// @vega-version 1.0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchPosts = exports.getPosts = void 0;
const getPosts = async function ({ page = 1, signal, providerContext }) {
  try {
    const { axios, cheerio } = providerContext;
    const BASE = "https://xhamster.com";
    const response = await axios.get(BASE + "/videos/new/" + page, { headers: { "User-Agent": "Mozilla/5.0", "Referer": BASE + "/" }, signal, timeout: 20000 });
    const $ = cheerio.load(response.data || "");
    const posts = [];
    const seen = new Set();
    $("a[href]").each((_, element) => {
      const el = $(element);
      const href = el.attr("href") || "";
      if (!/\/videos\/[^/?#]+/i.test(href)) return;
      const link = (href.startsWith("//") ? "https:" + href : href.startsWith("/") ? BASE + href : href).split("?")[0];
      if (seen.has(link)) return;
      seen.add(link);
      const title = el.attr("title") || el.find("img").attr("alt") || el.text().trim();
      let image = el.find("img").attr("data-src") || el.find("img").attr("src") || "";
      if (image.startsWith("//")) image = "https:" + image;
      if (image.startsWith("/")) image = BASE + image;
      if (title && image) posts.push({ title, link, image });
    });
    return posts;
  } catch { return []; }
};
exports.getPosts = getPosts;
const getSearchPosts = async function ({ searchQuery, page = 1, signal, providerContext }) {
  try {
    const { axios, cheerio } = providerContext;
    const BASE = "https://xhamster.com";
    const response = await axios.get(BASE + "/search/" + encodeURIComponent(searchQuery) + "?page=" + page, { headers: { "User-Agent": "Mozilla/5.0", "Referer": BASE + "/" }, signal, timeout: 20000 });
    const $ = cheerio.load(response.data || "");
    const posts = [];
    const seen = new Set();
    $("a[href]").each((_, element) => {
      const el = $(element);
      const href = el.attr("href") || "";
      if (!/\/videos\/[^/?#]+/i.test(href)) return;
      const link = (href.startsWith("//") ? "https:" + href : href.startsWith("/") ? BASE + href : href).split("?")[0];
      if (seen.has(link)) return;
      seen.add(link);
      const title = el.attr("title") || el.find("img").attr("alt") || el.text().trim();
      let image = el.find("img").attr("data-src") || el.find("img").attr("src") || "";
      if (image.startsWith("//")) image = "https:" + image;
      if (image.startsWith("/")) image = BASE + image;
      if (title && image) posts.push({ title, link, image });
    });
    return posts;
  } catch { return []; }
};
exports.getSearchPosts = getSearchPosts;
