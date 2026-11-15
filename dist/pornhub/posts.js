// @vega-provider pornhub
// @vega-version 1.1
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchPosts = exports.getPosts = void 0;
const getPosts = async function ({ page = 1, signal, providerContext }) {
  try {
    const { axios, cheerio } = providerContext;
    const BASE = "https://www.pornhub.com";
    const url = BASE + "/video?o=mr" + (page > 1 ? "&page=" + page : "");
    const res = await axios.get(url, { 
      headers: { 
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Cookie": "age_verified=1; accessAgeDisclaimerPH=1"
      }, 
      signal, 
      timeout: 20000 
    });
    const $ = cheerio.load(res.data || "");
    const posts = [];
    $("a[href*='view_video']").each((_, el) => {
      let link = ($(el).attr("href") || "").trim();
      if (!link) return;
      if (link.startsWith("/")) link = BASE + link;
      const title = $(el).attr("title") || $(el).text() || "Untitled";
      let image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || "";
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
    const BASE = "https://www.pornhub.com";
    const url = BASE + "/video/search?search=" + encodeURIComponent(searchQuery) + (page > 1 ? "&page=" + page : "");
    const res = await axios.get(url, { 
      headers: { 
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Cookie": "age_verified=1; accessAgeDisclaimerPH=1"
      }, 
      signal, 
      timeout: 20000 
    });
    const $ = cheerio.load(res.data || "");
    const posts = [];
    $("a[href*='view_video']").each((_, el) => {
      let link = ($(el).attr("href") || "").trim();
      if (!link) return;
      if (link.startsWith("/")) link = BASE + link;
      const title = $(el).attr("title") || $(el).text() || "Untitled";
      let image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || "";
      if (image.startsWith("//")) image = "https:" + image;
      if (title.length > 2) posts.push({ title, link, image });
    });
    return posts.slice(0, 50);
  } catch { return []; }
};
exports.getSearchPosts = getSearchPosts;
