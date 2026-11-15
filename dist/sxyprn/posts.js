// @vega-provider sxyprn
// @vega-version 1.0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPosts = void 0;
const getPosts = async function ({ page = 1, signal, providerContext }) {
  try {
    const { axios, cheerio } = providerContext;
    const BASE = "https://sxyprn.com";
    const res = await axios.get(BASE + "/?page=" + page, { headers: { "User-Agent": "Mozilla/5.0", "Accept": "text/html" }, signal, timeout: 20000 });
    const $ = cheerio.load(res.data || "");
    const posts = [];
    const seen = new Set();
    $("a[href*='/post/']").each((_, el) => {
      let link = $(el).attr("href") || "";
      if (!link || !/\/post\/[a-f0-9]+/i.test(link)) return;
      if (link.startsWith("/")) link = BASE + link;
      if (!link.startsWith(BASE) || seen.has(link)) return;
      seen.add(link);
      const title = $(el).attr("title") || $(el).text().trim() || "SxyPrn Video";
      let image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || "";
      if (image.startsWith("//")) image = "https:" + image;
      posts.push({ title, link, image });
    });
    return posts.slice(0, 40);
  } catch { return []; }
};
exports.getPosts = getPosts;
