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
const BASE = "https://desibabe.co";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function fetchPage(url, axios, cheerio, signal) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 20000 });
        const $ = cheerio.load(res.data || "");
        const posts = [];
        $("a[href*='/post/']").each((_, el) => {
            const $el = $(el);
            const link = $el.attr("href");
            if (!link || !link.includes("/post/"))
                return;
            const fullLink = link.startsWith("http") ? link : BASE + link;
            const title = $el.find("img").attr("alt") || $el.text().trim() || "Video";
            let image = $el.find("img").attr("src") || "";
            if (image && image.includes("url=")) {
                const match = image.match(/url=([^&]+)/);
                if (match)
                    image = decodeURIComponent(match[1]);
            }
            if (title)
                posts.push({ title, link: fullLink, image });
        });
        return posts;
    });
}
function getPosts(_a) {
    return __awaiter(this, arguments, void 0, function* ({ page = 1, signal, providerContext }) {
        try {
            const { axios, cheerio } = providerContext;
            const url = page > 1 ? `${BASE}/page/${page}` : `${BASE}/`;
            const posts = yield fetchPage(url, axios, cheerio, signal);
            const seen = new Set();
            return posts.filter(p => {
                if (seen.has(p.link))
                    return false;
                seen.add(p.link);
                return true;
            }).slice(0, 30);
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
            const allPosts = [];
            const seen = new Set();
            const maxPages = 20;
            const startPage = ((page || 1) - 1) * 5 + 1;
            const endPage = startPage + 5;
            for (let p = startPage; p < endPage && p <= maxPages; p++) {
                const url = p > 1 ? `${BASE}/page/${p}` : `${BASE}/`;
                const posts = yield fetchPage(url, axios, cheerio, signal);
                for (const post of posts) {
                    if (!seen.has(post.link)) {
                        seen.add(post.link);
                        allPosts.push(post);
                    }
                }
            }
            const query = searchQuery.toLowerCase();
            const filtered = allPosts.filter(p => p.title.toLowerCase().includes(query));
            return filtered.slice(0, 30);
        }
        catch (_b) {
            return [];
        }
    });
}
