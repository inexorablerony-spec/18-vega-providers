"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchPosts = exports.getPosts = void 0;
const BASE = "https://sxyprn.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function parse(html, cheerio) {
    const $ = cheerio.load(html || "");
    const posts = [];
    const seen = new Set();
    $("a.post_time[href*='/post/']").each((_, el) => {
        const $el = $(el);
        let link = ($el.attr("href") || "").split("?")[0];
        if (!link || !link.includes("/post/")) return;
        if (link.startsWith("/")) link = BASE + link;
        if (seen.has(link)) return;
        seen.add(link);
        let title = $el.attr("title") || $el.text().trim() || "Video";
        title = title.replace(/\{[^}]*\}/g, "").replace(/https?:\/\/\S+/g, "").trim();
        const $card = $el.closest("div").parent();
        let image = $card.find("img").attr("data-src") || $card.find("img").attr("src") || "";
        if (image.startsWith("//")) image = "https:" + image;
        else if (image.startsWith("/")) image = BASE + image;
        if (title.length > 3) posts.push({ title: title.slice(0, 140), link, image });
    });
    return posts.slice(0, 40);
}
async function getPosts({ page = 1, filter, signal, providerContext }) {
    try {
        const { axios, cheerio } = providerContext;
        const f = (filter || "trending").toLowerCase();
        const path = f === "new" ? "/new.html" : f === "latest" ? "/latest.html" : f === "popular" ? "/popular.html" : "/trending.html";
        const url = `${BASE}${path}?page=${page || 1}`;
        const res = await axios.get(url, { headers: { "User-Agent": UA, Referer: BASE + "/" }, signal, timeout: 20000 });
        return parse(res.data, cheerio);
    } catch { return []; }
}
exports.getPosts = getPosts;
async function getSearchPosts({ searchQuery, page = 1, signal, providerContext }) {
    try {
        const { axios, cheerio } = providerContext;
        const url = `${BASE}/search.html?q=${encodeURIComponent(searchQuery)}&page=${page || 1}`;
        const res = await axios.get(url, { headers: { "User-Agent": UA, Referer: BASE + "/" }, signal, timeout: 20000 });
        return parse(res.data, cheerio);
    } catch { return []; }
}
exports.getSearchPosts = getSearchPosts;
