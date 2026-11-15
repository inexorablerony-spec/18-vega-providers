// @vega-provider eporner
// @vega-version 1.1
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchPosts = exports.getPosts = void 0;
const getPosts = async function ({ filter, page = 1, signal, providerContext }) {
  try {
    const { axios, cheerio } = providerContext;
    const BASE = "https://www.eporner.com";
    const H = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", Accept: "text/html" };
    let url = BASE + "/";
    if (filter === "best-videos") url = BASE + "/best-videos/";
    else if (filter === "top-rated") url = BASE + "/top-rated/";
    if (page > 1) url += (url.includes("?") ? "&" : "?") + "page=" + page;
    const res = await axios.get(url, { headers: H, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts = [];
    const seen = new Set();
    $("a[href*='/video-'], a[href*='/hd-porn/']").each((_, el) => {
      let link = ($(el).attr("href") || "").trim();
      if (!link || seen.has(link)) return;
      if (link.startsWith("/")) link = BASE + link;
      if (!link.includes("/video-") && !link.includes("/hd-porn/")) return;
      seen.add(link);
      const title = ($(el).attr("title") || $(el).find("img").attr("alt") || $(el).text() || "Untitled").trim().slice(0, 120);
      let image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || "";
      if (image.startsWith("//")) image = "https:" + image;
      if (title.length > 2) posts.push({ title, link, image });
    });
    return posts.slice(0, 60);
  } catch { return []; }
};
exports.getPosts = getPosts;
const getSearchPosts = async function ({ searchQuery, page = 1, signal, providerContext }) {
  try {
    const { axios, cheerio } = providerContext;
    const BASE = "https://www.eporner.com";
    const H = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", Accept: "text/html" };
    const url = BASE + "/search/" + encodeURIComponent(searchQuery) + "/" + (page > 1 ? "?page=" + page : "");
    const res = await axios.get(url, { headers: H, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts = [];
    $("a[href*='/video-']").each((_, el) => {
      let link = ($(el).attr("href") || "").trim();
      if (!link) return;
      if (link.startsWith("/")) link = BASE + link;
      const title = ($(el).attr("title") || $(el).find("img").attr("alt") || "Untitled").trim();
      let image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || "";
      if (image.startsWith("//")) image = "https:" + image;
      posts.push({ title, link, image });
    });
    return posts.slice(0, 50);
  } catch { return []; }
};
exports.getSearchPosts = getSearchPosts;
