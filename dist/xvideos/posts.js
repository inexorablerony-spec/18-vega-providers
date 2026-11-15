// @vega-provider xvideos
// @vega-version 1.0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchPosts = exports.getPosts = void 0;
const getPosts = async function ({ filter, page = 1, signal, providerContext }) {
  try {
    const { axios, cheerio } = providerContext;
    const BASE = "https://www.xvideos.com";
    const H = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36", Accept: "text/html" };
    const url = page > 1 ? BASE + "/new/" + page : BASE + "/";
    const res = await axios.get(url, { headers: H, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts = [];
    $(".thumb-block").each((_, el) => {
      const a = $(el).find("a").first();
      let link = (a.attr("href") || "").trim();
      if (!link.includes("/video")) return;
      if (link.startsWith("/")) link = BASE + link;
      const title = $(el).find(".title").text().trim() || "Untitled";
      let image = a.find("img").attr("data-src") || a.find("img").attr("src") || "";
      if (image.startsWith("//")) image = "https:" + image;
      posts.push({ title, link, image });
    });
    return posts.slice(0, 60);
  } catch { return []; }
};
exports.getPosts = getPosts;
const getSearchPosts = async function ({ searchQuery, page = 1, signal, providerContext }) {
  try {
    const { axios, cheerio } = providerContext;
    const BASE = "https://www.xvideos.com";
    const H = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36", Accept: "text/html" };
    const url = BASE + "/?k=" + encodeURIComponent(searchQuery) + (page > 1 ? "&p=" + page : "");
    const res = await axios.get(url, { headers: H, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts = [];
    const seen = new Set();
    $("a[href*='/video.']").each((_, el) => {
      let link = ($(el).attr("href") || "").trim();
      if (!link || seen.has(link)) return;
      seen.add(link);
      if (link.startsWith("/")) link = BASE + link;
      const title = ($(el).attr("title") || $(el).find(".title").text() || $(el).text() || "Untitled").trim().slice(0, 120);
      let image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || "";
      if (image.startsWith("//")) image = "https:" + image;
      if (title.length > 3) posts.push({ title, link, image });
    });
    return posts.slice(0, 50);
  } catch { return []; }
};
exports.getSearchPosts = getSearchPosts;
