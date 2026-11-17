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
const BASE = "https://borntobefuck.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
function parseHtml(html, cheerio) {
    return __awaiter(this, void 0, void 0, function* () {
        const $ = cheerio.load(html || "");
        const posts = [];
        const seen = new Set();
        $("img.thumbnail").each((_, el) => {
            const $img = $(el);
            const $link = $img.closest("a");
            const link = $link.attr("href") || "";
            if (!link || !link.includes("/watch/") || seen.has(link))
                return;
            seen.add(link);
            const title = $img.attr("title") || $img.attr("alt") || "Video";
            const image = $img.attr("src") || "";
            if (title && link)
                posts.push({ title, link, image });
        });
        return posts;
    });
}
function getPosts(_a) {
    return __awaiter(this, arguments, void 0, function* ({ page = 1, signal, providerContext }) {
        try {
            const { axios, cheerio } = providerContext;
            const url = page > 1 ? `${BASE}/?page=${page}` : `${BASE}/`;
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
        return [];
    });
}
