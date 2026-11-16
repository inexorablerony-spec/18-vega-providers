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
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
function getPosts(_a) {
    return __awaiter(this, arguments, void 0, function* ({ page = 1, signal, providerContext }) {
        try {
            const { axios, cheerio } = providerContext;
            const url = page > 1 ? `${BASE}/?page=${page}` : BASE;
            const res = yield axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 25000 });
            const $ = cheerio.load(res.data || "");
            const posts = [];
            const seen = new Set();
            $(".item_cont").each((_, el) => {
                const $el = $(el);
                const $a = $el.find("a[href*='/videos/']").first();
                let link = $a.attr("href") || "";
                if (!link || seen.has(link))
                    return;
                if (link.startsWith("/"))
                    link = BASE + link;
                seen.add(link);
                const title = $el.find(".item_title").first().text().trim() || $a.attr("title") || "Video";
                let image = $el.find(".item_img").attr("data-src") || $el.find(".item_img").attr("src") || "";
                if (image && image.startsWith("/"))
                    image = BASE + image;
                if (title && link)
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
            const res = yield axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 25000 });
            const $ = cheerio.load(res.data || "");
            const posts = [];
            const seen = new Set();
            $(".item_cont").each((_, el) => {
                const $el = $(el);
                const $a = $el.find("a[href*='/videos/']").first();
                let link = $a.attr("href") || "";
                if (!link || seen.has(link))
                    return;
                if (link.startsWith("/"))
                    link = BASE + link;
                seen.add(link);
                const title = $el.find(".item_title").first().text().trim() || "Result";
                let image = $el.find(".item_img").attr("data-src") || $el.find(".item_img").attr("src") || "";
                if (image && image.startsWith("/"))
                    image = BASE + image;
                if (title && link)
                    posts.push({ title, link, image });
            });
            return posts.slice(0, 30);
        }
        catch (_b) {
            return [];
        }
    });
}
