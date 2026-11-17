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
const BASE = "https://dirtyship.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
function parseHtml(html, cheerio) {
    return __awaiter(this, void 0, void 0, function* () {
        const $ = cheerio.load(html || "");
        const posts = [];
        const seen = new Set();
        $("a[href*='dirtyship.com/']").each((_, el) => {
            const $el = $(el);
            const link = $el.attr("href");
            if (!link || link.includes("/page/") || link.includes("/wp-") || link.includes("/category/") || link.includes("/tag/") || link.includes("/actor") || link.includes("/performer"))
                return;
            if (seen.has(link))
                return;
            seen.add(link);
            const title = $el.attr("title") || $el.find("img").attr("alt") || $el.text().trim() || "Video";
            let image = $el.find("img").attr("data-src") || $el.find("img").attr("src") || "";
            if (image && image.startsWith("//"))
                image = "https:" + image;
            if (title && link.includes("-"))
                posts.push({ title, link, image });
        });
        return posts;
    });
}
function getPosts(_a) {
    return __awaiter(this, arguments, void 0, function* ({ page = 1, signal, providerContext }) {
        try {
            const { axios, cheerio } = providerContext;
            const url = page > 1 ? `${BASE}/page/${page}/` : `${BASE}/`;
            const res = yield axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 25000 });
            return yield parseHtml(res.data, cheerio);
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
            const url = `${BASE}/?s=${encodeURIComponent(searchQuery)}&paged=${page || 1}`;
            const res = yield axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 25000 });
            return yield parseHtml(res.data, cheerio);
        }
        catch (_b) {
            return [];
        }
    });
}
