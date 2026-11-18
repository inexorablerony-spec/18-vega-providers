"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPosts = getPosts;
exports.getSearchPosts = getSearchPosts;
const BASE = "https://hellporno.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function parseHtml(html, cheerio) {
    const $ = cheerio.load(html || "");
    const posts = [];
    const seen = new Set();
    $(".video-thumb").each((_, el) => {
        const $el = $(el);
        const $link = $el.find("a.title").first();
        const link = $link.attr("href") || "";
        if (!link || !link.includes("/videos/") || seen.has(link))
            return;
        const fullLink = link.startsWith("http") ? link : BASE + link;
        seen.add(fullLink);
        const title = $link.text().trim() || $el.find("img").attr("alt") || "Video";
        // Image from poster or img src
        let image = $el.find("video").attr("poster") || $el.find("img").attr("src") || "";
        if (image && image.startsWith("//"))
            image = "https:" + image;
        if (title && title.length > 3) {
            posts.push({ title, link: fullLink, image });
        }
    });
    return posts.slice(0, 30);
}
function getPosts(_a) {
    return __awaiter(this, arguments, void 0, function* ({ page = 1, signal, providerContext }) {
        try {
            const { axios, cheerio } = providerContext;
            const url = page > 1 ? `${BASE}/?page=${page}` : `${BASE}/`;
            const res = yield axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 20000 });
            return parseHtml(res.data, cheerio);
        }
        catch (_b) {
            return [];
        }
    });
}
function getSearchPosts(_a) {
    return __awaiter(this, arguments, void 0, function* ({ searchQuery, page = 1, signal, providerContext }) {
        try {
            const { axios, cheerio } = providerContext;
            const q = encodeURIComponent(searchQuery).replace(/%20/g, "-");
            const url = `${BASE}/search/${q}/${page > 1 ? `?page=${page}` : ""}`;
            const res = yield axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 20000 });
            return parseHtml(res.data, cheerio);
        }
        catch (_b) {
            return [];
        }
    });
}
