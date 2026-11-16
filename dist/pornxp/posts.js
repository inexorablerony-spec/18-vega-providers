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
const BASE = "https://pxp.pink";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function getPosts(_a) {
    return __awaiter(this, arguments, void 0, function* ({ page = 1, signal, providerContext }) {
        try {
            const { axios, cheerio } = providerContext;
            const url = page > 1 ? `${BASE}/?page=${page}` : BASE;
            const res = yield axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 20000 });
            const $ = cheerio.load(res.data || "");
            const posts = [];
            $(".video, .item, .thumb, article").each((_, el) => {
                const $el = $(el);
                const $a = $el.find("a[href]").first();
                let link = $a.attr("href") || "";
                if (link.startsWith("/"))
                    link = BASE + link;
                const title = $el.find(".title, h2, h3").first().text().trim() || $a.attr("title") || "Video";
                const image = $el.find("img").attr("data-src") || $el.find("img").attr("src") || "";
                if (link && title)
                    posts.push({ title, link, image });
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
            const url = `${BASE}/search?q=${encodeURIComponent(searchQuery)}&page=${page}`;
            const res = yield axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 20000 });
            const $ = cheerio.load(res.data || "");
            const posts = [];
            $(".video, .item, .thumb").each((_, el) => {
                const $el = $(el);
                const $a = $el.find("a[href]").first();
                let link = $a.attr("href") || "";
                if (link.startsWith("/"))
                    link = BASE + link;
                const title = $el.find(".title, h2").first().text().trim() || "Result";
                const image = $el.find("img").attr("src") || "";
                if (link)
                    posts.push({ title, link, image });
            });
            return posts.slice(0, 30);
        }
        catch (_b) {
            return [];
        }
    });
}
