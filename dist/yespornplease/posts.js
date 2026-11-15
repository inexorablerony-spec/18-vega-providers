// @vega-provider yespornplease
// @vega-version 1.0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchPosts = exports.getPosts = void 0;
const getPosts = async function ({ filter, page = 1, signal, providerContext }) {
  try {
    const { axios, cheerio } = providerContext;
    const BASE = "https://yespornplease.xxx";
    const H = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36", Accept: "text/html" };
    const url = BASE + "/" + (page > 1 ? "?page=" + page : "");
    const res = await axios.get(url, { headers: H, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts = [];
    const seen = new Set();
    $("a[href*='/video'], a[href*='/videos/'], a[href*='/v/']").each((_, el) => {
      let link = ($(el).attr("href") || "").trim();
      if (!link) return;
      if (link.startsWith("//")) link = "https:" + link;
      else if (link.startsWith("/")) link = BASE + link;
      if (!/\/(video|videos|v)\//.test(link) || seen.has(link)) return;
      if (/\/(categories|tags|models|channels|search)\//i.test(link)) return;
      const title = ($(el).attr("title") || $(el).find("img").attr("alt") || $(el).text() || "Untitled").trim();
      let image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || "";
      if (image.startsWith("//")) image = "https:" + image;
      seen.add(link);
      posts.push({ title, link, image });
    });
    return posts.slice(0, 80);
  } catch { return []; }
};
exports.getPosts = getPosts;
const getSearchPosts = async function ({ searchQuery, page = 1, signal, providerContext }) {
  try {
    const { axios, cheerio } = providerContext;
    const BASE = "https://yespornplease.xxx";
    const H = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36", Accept: "text/html" };
    const q = encodeURIComponent(searchQuery).replace(/%20/g, "+");
    const url = BASE + "/search/" + q + "/" + (page > 1 ? "?page=" + page : "");
    const res = await axios.get(url, { headers: H, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts = [];
    const seen = new Set();
    $("a[href*='/video'], a[href*='/videos/'], a[href*='/v/']").each((_, el) => {
      let link = ($(el).attr("href") || "").trim();
      if (!link) return;
      if (link.startsWith("//")) link = "https:" + link;
      else if (link.startsWith("/")) link = BASE + link;
      if (!/\/(video|videos|v)\//.test(link) || seen.has(link)) return;
      const title = ($(el).attr("title") || $(el).find("img").attr("alt") || $(el).text() || "Untitled").trim();
      let image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || "";
      if (image.startsWith("//")) image = "https:" + image;
      seen.add(link);
      posts.push({ title, link, image });
    });
    return posts.slice(0, 60);
  } catch { return []; }
};
exports.getSearchPosts = getSearchPosts;
