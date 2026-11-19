"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPosts = getPosts;
exports.getSearchPosts = getSearchPosts;
const BASE = "https://www.3movs.com";
const H = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" };

async function getPosts({ page = 1, signal, providerContext }) {
  try {
    const { axios, cheerio } = providerContext;
    const url = page > 1 ? `${BASE}/?page=${page}` : `${BASE}/`;
    const res = await axios.get(url, { headers: H, signal, timeout: 20000 });
    return parseHtml(res.data, cheerio);
  } catch { return []; }
}

async function getSearchPosts({ searchQuery, page = 1, signal, providerContext }) {
  try {
    const { axios, cheerio } = providerContext;
    const url = `${BASE}/search_videos/?q=${encodeURIComponent(searchQuery)}${page > 1 ? `&page=${page}` : ""}`;
    const res = await axios.get(url, { headers: H, signal, timeout: 20000 });
    return parseHtml(res.data, cheerio);
  } catch { return []; }
}

function parseHtml(html, cheerio) {
  const $ = cheerio.load(html || "");
  const posts = [];
  const seen = new Set();
  $("a[href*='/videos/']").each((_, el) => {
    let link = ($(el).attr("href") || "").trim();
    if (!link || seen.has(link)) return;
    if (link.startsWith("//")) link = "https:" + link;
    else if (link.startsWith("/")) link = BASE + link;
    if (!link.includes("/videos/") || link.endsWith("/videos/") || link.includes("search_videos")) return;
    seen.add(link);
    const title = $(el).attr("title") || $(el).find("img").attr("alt") || $(el).text().trim() || "Video";
    let image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || "";
    if (image && image.startsWith("//")) image = "https:" + image;
    if (image && image.startsWith("data:")) image = $(el).find("img").attr("data-src") || "";
    if (title && title.length > 2 && title !== "Videos") posts.push({ title, link, image });
  });
  return posts.slice(0, 30);
}
