// @vega-provider sxyprn
// @vega-version 1.1
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchPosts = exports.getPosts = void 0;
const getPosts = async function ({ page = 1, signal, providerContext }) {
  try {
    const { axios, cheerio } = providerContext;
    const BASE = "https://sxyprn.com";
    const res = await axios.get(BASE + "/", { headers: { "User-Agent": "Mozilla/5.0" }, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts = [];
    const seen = new Set();
    $("a[href*='/post/'], .hash_link").each((_, el) => {
      let link = $(el).attr("href") || $(el).find("a").attr("href") || "";
      if (!link || !link.includes("/post/")) return;
      if (link.startsWith("/")) link = BASE + link;
      if (seen.has(link)) return;
      seen.add(link);
      const title = $(el).attr("title") || $(el).find("img").attr("alt") || "SxyPrn Video";
      let image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || "";
      if (image.startsWith("//")) image = "https:" + image;
      posts.push({ title, link, image });
    });
    return posts.slice(0, 40);
  } catch { return []; }
};
exports.getPosts = getPosts;
const getSearchPosts = async function ({ searchQuery, page = 1, signal, providerContext }) {
  try {
    const { axios, cheerio } = providerContext;
    const BASE = "https://sxyprn.com";
    const res = await axios.get(BASE + "/search/" + encodeURIComponent(searchQuery).replace(/%20/g, "-") + "/", { headers: { "User-Agent": "Mozilla/5.0" }, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts = [];
    const seen = new Set();
    $("a[href*='/post/']").each((_, el) => {
      let link = $(el).attr("href") || "";
      if (!link || !link.includes("/post/")) return;
      if (link.startsWith("/")) link = BASE + link;
      if (seen.has(link)) return;
      seen.add(link);
      const title = $(el).attr("title") || "SxyPrn Video";
      let image = $(el).find("img").attr("src") || "";
      if (image.startsWith("//")) image = "https:" + image;
      posts.push({ title, link, image });
    });
    return posts.slice(0, 40);
  } catch { return []; }
};
exports.getSearchPosts = getSearchPosts;
