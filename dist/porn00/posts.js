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
const BASE = "https://www.porn00.org";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function parseHtml(html, cheerio) {
    return __awaiter(this, void 0, void 0, function* () {
        const $ = cheerio.load(html || "");
        const posts = [];
        const seen = new Set();
        $("a[href*='/video/']").each((_, el) => {
            const $el = $(el);
            const link = $el.attr("href");
            if (!link || !link.includes("/video/") || seen.has(link))
                return;
            const fullLink = link.startsWith("http") ? link : BASE + link;
            seen.add(fullLink);
            const title = $el.attr("title") || $el.find("img").attr("alt") || $el.text().trim() || "Video";
            let image = $el.find("img").attr("data-src") || $el.find("img").attr("src") || "";
            if (image && image.startsWith("//"))
                image = "https:" + image;
            if (image && image.startsWith("/"))
                image = BASE + image;
            if (title && title.length > 3)
                posts.push({ title, link: fullLink, image });
        });
        return posts.slice(0, 30);
    });
}
function getPosts(_a) {
    return __awaiter(this, arguments, void 0, function* ({ page = 1, signal, providerContext }) {
        try {
            const { axios, cheerio } = providerContext;
            const url = page > 1 ? `${BASE}/latest-vids/?page=${page}` : `${BASE}/latest-vids/`;
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
            const url = `${BASE}/searching/${encodeURIComponent(searchQuery)}/?page=${page || 1}`;
            const res = yield axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 25000 });
            return yield parseHtml(res.data, cheerio);
        }
        catch (_b) {
            return [];
        }
    });
}
