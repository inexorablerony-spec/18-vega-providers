"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPosts = void 0;
exports.getSearchPosts = void 0;
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const BASE = "https://xhamster.com";
function abs(url) { if (!url) return ""; try { return new URL(url, BASE).href; } catch { return ""; } }
function parseCards(html, cheerio) {
  const $ = cheerio.load(html);
  const result = [];
  const seen = new Set();
  $("a[href*='/videos/']").each((_, node) => {
    const a = $(node);
    const href = a.attr("href") || "";
    if (!/\/videos\/[^/?#]+-[a-z0-9]+/i.test(href)) return;
    const link = abs(href).split("?")[0];
    if (!link || seen.has(link)) return;
    const img = a.find("img").first();
    const title = a.attr("title") || img.attr("alt") || a.text().trim();
    const image = abs(img.attr("data-src") || img.attr("data-original") || img.attr("src") || "");
    if (!title) return;
    seen.add(link);
    result.push({ title: title.trim(), link, image });
  });
  return result;
}
const getPosts = async function ({ filter, page = 1, signal, providerContext }) {
  try {
    const { axios, cheerio } = providerContext;
    let url = filter || BASE + "/";
    if (page > 1) url += (url.includes("?") ? "&" : "?") + "page=" + page;
    const response = await axios.get(url, { headers: { "User-Agent": UA, Referer: BASE + "/" }, signal, timeout: 25000 });
    return parseCards(String(response.data || ""), cheerio);
  } catch { return []; }
};
const getSearchPosts = async function ({ searchQuery, page = 1, signal, providerContext }) {
  try {
    const { axios, cheerio } = providerContext;
    const url = `${BASE}/search/${encodeURIComponent(searchQuery)}?page=${page}`;
    const response = await axios.get(url, { headers: { "User-Agent": UA, Referer: BASE + "/" }, signal, timeout: 25000 });
    return parseCards(String(response.data || ""), cheerio);
  } catch { return []; }
};
exports.getPosts = getPosts;
exports.getSearchPosts = getSearchPosts;
