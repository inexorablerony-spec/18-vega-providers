"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPosts = getPosts;
exports.getSearchPosts = getSearchPosts;
const BASE = "https://www.alphaporno.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

async function getPosts({ page = 1, signal, providerContext }) {
  try {
    const { axios, cheerio } = providerContext;
    const url = page > 1 ? `${BASE}/?page=${page}` : `${BASE}/`;
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 20000 });
    return parseHtml(res.data, cheerio);
  } catch { return []; }
}

async function getSearchPosts({ searchQuery, page = 1, signal, providerContext }) {
  try {
    const { axios, cheerio } = providerContext;
    const url = `${BASE}/search/?q=${encodeURIComponent(searchQuery)}${page > 1 ? `&page=${page}` : ""}`;
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 20000 });
    return parseHtml(res.data, cheerio);
  } catch { return []; }
}

function parseHtml(html, cheerio) {
  const $ = cheerio.load(html || "");
  const posts = [];
  const seen = new Set();
  $("a[href*='/videos/']").each((_, el) => {
    let link = ($(el).attr("href") || "").trim();
    if (!link || seen.has(link) || link.includes("$video_link$")) return;
    if (link.startsWith("//")) link = "https:" + link;
    else if (link.startsWith("/")) link = BASE + link;
    if (!link.includes("/videos/")) return;
    seen.add(link);
    const title = $(el).attr("title") || $(el).find("img").attr("alt") || "Video";
    let image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || "";
    if (image && image.startsWith("//")) image = "https:" + image;
    if (title && title.length > 2) posts.push({ title, link, image });
  });
  return posts.slice(0, 30);
}
