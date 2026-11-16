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
const BASE = "https://www.erome.com";
function getPosts(_a) {
    return __awaiter(this, arguments, void 0, function* ({ page = 1, signal, providerContext }) {
        try {
            const { axios, cheerio } = providerContext;
            const res = yield axios.get(`${BASE}/explore`, { headers: { "User-Agent": "Mozilla/5.0", "Accept": "text/html" }, signal, timeout: 20000 });
            const $ = cheerio.load(res.data || "");
            const posts = [];
            const seen = new Set();
            // Try multiple selectors
            $("a[href*='/a/'], .album, .album-item").each((_, el) => {
                let link = $(el).attr("href") || $(el).find("a").attr("href") || "";
                if (!link || !link.includes("/a/"))
                    return;
                if (link.startsWith("/"))
                    link = BASE + link;
                if (seen.has(link))
                    return;
                seen.add(link);
                const title = $(el).attr("title") || $(el).find("img").attr("alt") || $(el).text().trim() || "Erome Album";
                let image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || "";
                if (image.startsWith("//"))
                    image = "https:" + image;
                if (title.length > 2)
                    posts.push({ title, link, image });
            });
            return posts.slice(0, 40);
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
            const res = yield axios.get(`${BASE}/search?q=${encodeURIComponent(searchQuery)}`, { headers: { "User-Agent": "Mozilla/5.0" }, signal, timeout: 20000 });
            const $ = cheerio.load(res.data || "");
            const posts = [];
            const seen = new Set();
            $("a[href*='/a/']").each((_, el) => {
                let link = $(el).attr("href") || "";
                if (!link || !link.includes("/a/"))
                    return;
                if (link.startsWith("/"))
                    link = BASE + link;
                if (seen.has(link))
                    return;
                seen.add(link);
                const title = $(el).attr("title") || $(el).text().trim() || "Erome Album";
                let image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || "";
                if (image.startsWith("//"))
                    image = "https:" + image;
                posts.push({ title, link, image });
            });
            return posts.slice(0, 40);
        }
        catch (_b) {
            return [];
        }
    });
}
