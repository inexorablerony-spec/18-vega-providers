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
const BASE = "https://noodlemagazine.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function getImage($el) {
    const img = $el.find("img").first();
    if (!img.length)
        return "";
    return (img.attr("data-src") ||
        img.attr("data-original") ||
        img.attr("data-lazy-src") ||
        img.attr("src") ||
        "");
}
function getPosts(_a) {
    return __awaiter(this, arguments, void 0, function* ({ page = 1, signal, providerContext }) {
        try {
            const { axios, cheerio } = providerContext;
            const url = `${BASE}/home`;
            const res = yield axios.get(url, { params: { page }, headers: { "User-Agent": UA }, signal, timeout: 20000 });
            const $ = cheerio.load(res.data || "");
            const posts = [];
            $("a[href*='/watch/']").each((_, el) => {
                const $el = $(el);
                const link = $el.attr("href");
                const title = $el.attr("title") || $el.find("img").attr("alt") || $el.text().trim() || "Video";
                let image = getImage($el);
                if (image && image.startsWith("/"))
                    image = BASE + image;
                if (image && image.startsWith("//"))
                    image = "https:" + image;
                if (link && title) {
                    posts.push({ title, link: link.startsWith("http") ? link : BASE + link, image });
                }
            });
            return posts.slice(0, 30);
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
            const url = `${BASE}/search?q=${encodeURIComponent(searchQuery)}`;
            const res = yield axios.get(url, { params: { page }, headers: { "User-Agent": UA }, signal, timeout: 20000 });
            const $ = cheerio.load(res.data || "");
            const posts = [];
            $("a[href*='/watch/']").each((_, el) => {
                const $el = $(el);
                const link = $el.attr("href");
                const title = $el.attr("title") || $el.find("img").attr("alt") || "Result";
                let image = getImage($el);
                if (image && image.startsWith("/"))
                    image = BASE + image;
                if (image && image.startsWith("//"))
                    image = "https:" + image;
                if (link)
                    posts.push({ title, link: link.startsWith("http") ? link : BASE + link, image });
            });
            return posts.slice(0, 30);
        }
        catch (_b) {
            return [];
        }
    });
}
