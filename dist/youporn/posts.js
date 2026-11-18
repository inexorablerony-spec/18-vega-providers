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
const BASE = "https://www.youporn.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
function parseHtml(html, cheerio) {
    return __awaiter(this, void 0, void 0, function* () {
        const $ = cheerio.load(html || "");
        const posts = [];
        const seen = new Set();
        $("article.video-box").each((_, el) => {
            const $el = $(el);
            const $link = $el.find("a[href*='/watch/']").first();
            const link = $link.attr("href");
            if (!link || !link.includes("/watch/") || link.includes("/watch-history"))
                return;
            const fullLink = link.startsWith("http") ? link : BASE + link;
            if (seen.has(fullLink))
                return;
            seen.add(fullLink);
            // Title from aria-label on article, or alt on img, or title attribute
            const title = $el.attr("aria-label") ||
                $el.find("img").attr("alt") ||
                $link.attr("title") ||
                "Video";
            // Image from data-src (lazy loaded) or src
            let image = $el.find("img").attr("data-src") ||
                $el.find("img").attr("data-poster") ||
                $el.find("img").attr("src") || "";
            if (image && image.startsWith("//"))
                image = "https:" + image;
            if (image && image.startsWith("/"))
                image = BASE + image;
            // Skip placeholder images
            if (image.includes("data:image"))
                image = $el.find("img").attr("data-src") || "";
            if (title && title.length > 3 && title !== "Video") {
                posts.push({ title, link: fullLink, image });
            }
        });
        return posts.slice(0, 30);
    });
}
function getPosts(_a) {
    return __awaiter(this, arguments, void 0, function* ({ page = 1, signal, providerContext }) {
        try {
            const { axios, cheerio } = providerContext;
            const url = page > 1 ? `${BASE}/?page=${page}` : `${BASE}/`;
            const res = yield axios.get(url, {
                headers: {
                    "User-Agent": UA,
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
                },
                signal,
                timeout: 25000
            });
            return yield parseHtml(res.data, cheerio);
        }
        catch (e) {
            console.error("YouPorn getPosts error:", e);
            return [];
        }
    });
}
function getSearchPosts(_a) {
    return __awaiter(this, arguments, void 0, function* ({ searchQuery, page = 1, signal, providerContext }) {
        try {
            const { axios, cheerio } = providerContext;
            const url = `${BASE}/search/?query=${encodeURIComponent(searchQuery)}&page=${page || 1}`;
            const res = yield axios.get(url, {
                headers: {
                    "User-Agent": UA,
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
                },
                signal,
                timeout: 25000
            });
            return yield parseHtml(res.data, cheerio);
        }
        catch (e) {
            console.error("YouPorn getSearchPosts error:", e);
            return [];
        }
    });
}
