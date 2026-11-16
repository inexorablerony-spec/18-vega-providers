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
const BASE = "https://sxyprn.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function getPosts(_a) {
    return __awaiter(this, arguments, void 0, function* ({ page = 1, signal, providerContext }) {
        try {
            const { axios, cheerio } = providerContext;
            const url = page > 1 ? `${BASE}/trending.html?page=${page}` : `${BASE}/trending.html`;
            const res = yield axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 20000 });
            const $ = cheerio.load(res.data || "");
            const posts = [];
            $("a[href*='/post/']").each((_, el) => {
                const $el = $(el);
                const link = $el.attr("href");
                if (!link || !link.includes("/post/"))
                    return;
                const title = $el.attr("aria-label") || $el.attr("title") || "Video";
                let image = $el.find("img").attr("data-src") || $el.find("img").attr("src") || "";
                if (image && image.startsWith("//"))
                    image = "https:" + image;
                if (image && image.startsWith("/"))
                    image = BASE + image;
                posts.push({ title: title.replace(/\s*video$/i, "").trim(), link: link.startsWith("http") ? link : BASE + link, image });
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
            const url = `${BASE}/search.html?q=${encodeURIComponent(searchQuery)}&page=${page}`;
            const res = yield axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 20000 });
            const $ = cheerio.load(res.data || "");
            const posts = [];
            $("a[href*='/post/']").each((_, el) => {
                const $el = $(el);
                const link = $el.attr("href");
                if (!link)
                    return;
                const title = $el.attr("aria-label") || $el.attr("title") || "Result";
                let image = $el.find("img").attr("data-src") || $el.find("img").attr("src") || "";
                if (image && image.startsWith("//"))
                    image = "https:" + image;
                posts.push({ title, link: link.startsWith("http") ? link : BASE + link, image });
            });
            return posts.slice(0, 30);
        }
        catch (_b) {
            return [];
        }
    });
}
