// @vega-provider hqporner
// @vega-version 1.0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchPosts = exports.getPosts = void 0;
const getPosts = async function ({ page = 1, signal, providerContext }) {
  try {
    const { axios, cheerio } = providerContext;
    const BASE = "https://hqporner.com";
    const H = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", Accept: "text/html" };
    const url = BASE + "/" + (page > 1 ? "?p=" + page : "");
    const res = await axios.get(url, { headers: H, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts = [];
    $("section.box.feature, a[href*='/hdporn/']").each((_, el) => {
      const a = $(el).is("a") ? $(el) : $(el).find('a[href*="/hdporn/"]').first();
      let link = (a.attr("href") || "").trim();
      if (!link || !link.includes("/hdporn/")) return;
      if (link.startsWith("/")) link = BASE + link;
      const title = ($(el).find("h3 a").text() || a.attr("title") || "Untitled").trim().slice(0, 120);
      let image = a.find("img").attr("src") || "";
      if (image.startsWith("//")) image = "https:" + image;
      if (title.length > 2) posts.push({ title, link, image });
    });
    return posts.slice(0, 50);
  } catch { return []; }
};
exports.getPosts = getPosts;
const getSearchPosts = async function ({ searchQuery, page = 1, signal, providerContext }) {
  try {
    const { axios, cheerio } = providerContext;
    const BASE = "https://hqporner.com";
    const H = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", Accept: "text/html" };
    const url = BASE + "/?q=" + encodeURIComponent(searchQuery) + (page > 1 ? "&p=" + page : "");
    const res = await axios.get(url, { headers: H, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts = [];
    const seen = new Set();
    $("a[href*='/hdporn/']").each((_, el) => {
      let link = ($(el).attr("href") || "").trim();
      if (!link || seen.has(link)) return;
      seen.add(link);
      if (link.startsWith("/")) link = BASE + link;
      const title = ($(el).attr("title") || $(el).text() || "Untitled").trim();
      let image = $(el).find("img").attr("src") || "";
      if (image.startsWith("//")) image = "https:" + image;
      posts.push({ title, link, image });
    });
    return posts.slice(0, 50);
  } catch { return []; }
};
exports.getSearchPosts = getSearchPosts;
