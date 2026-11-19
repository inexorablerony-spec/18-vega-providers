"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPosts = getPosts;
exports.getSearchPosts = getSearchPosts;
const BASE = "https://www.tnaflix.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

async function getPosts({ page = 1, signal, providerContext }) {
  try {
    const { axios, cheerio } = providerContext;
    const url = page > 1 ? `${BASE}/?page=${page}` : `${BASE}/`;
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 25000 });
    return parseHtml(res.data, cheerio);
  } catch { return []; }
}

async function getSearchPosts({ searchQuery, page = 1, signal, providerContext }) {
  try {
    const { axios, cheerio } = providerContext;
    const url = `${BASE}/search?what=${encodeURIComponent(searchQuery)}&page=${page || 1}`;
    const res = await axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 25000 });
    return parseHtml(res.data, cheerio);
  } catch { return []; }
}

function parseHtml(html, cheerio) {
  const $ = cheerio.load(html || "");
  const posts = [];
  const seen = new Set();
  $("a[href*='/video']").each((_, el) => {
    const $el = $(el);
    const link = $el.attr("href");
    if (!link || !link.includes("/video") || seen.has(link)) return;
    const fullLink = link.startsWith("http") ? link : BASE + link;
    seen.add(fullLink);
    const title = $el.attr("title") || $el.find("img").attr("alt") || "Video";
    let image = $el.find("img").attr("data-src") || $el.find("img").attr("src") || "";
    if (image && image.startsWith("//")) image = "https:" + image;
    if (title && title.length > 3) posts.push({ title, link: fullLink, image });
  });
  return posts.slice(0, 30);
}
