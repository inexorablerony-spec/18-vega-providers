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
const BASE = "https://hqporner.com";
const H = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", Accept: "text/html" };
function getPosts(_a) {
    return __awaiter(this, arguments, void 0, function* ({ page = 1, signal, providerContext }) {
        try {
            const { axios, cheerio } = providerContext;
            const url = BASE + "/" + (page > 1 ? "?p=" + page : "");
            const res = yield axios.get(url, { headers: H, signal, timeout: 20000 });
            const $ = cheerio.load(res.data || "");
            const posts = [];
            $("section.box.feature, a[href*='/hdporn/']").each((_, el) => {
                const a = $(el).is("a") ? $(el) : $(el).find('a[href*="/hdporn/"]').first();
                let link = (a.attr("href") || "").trim();
                if (!link || !link.includes("/hdporn/"))
                    return;
                if (link.startsWith("/"))
                    link = BASE + link;
                const title = ($(el).find("h3 a").text() || a.attr("title") || "Untitled").trim().slice(0, 120);
                let image = a.find("img").attr("src") || "";
                if (image.startsWith("//"))
                    image = "https:" + image;
                if (title.length > 2)
                    posts.push({ title, link, image });
            });
            return posts.slice(0, 50);
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
            const url = BASE + "/?q=" + encodeURIComponent(searchQuery) + (page > 1 ? "&p=" + page : "");
            const res = yield axios.get(url, { headers: H, signal, timeout: 20000 });
            const $ = cheerio.load(res.data || "");
            const posts = [];
            const seen = new Set();
            $("a[href*='/hdporn/']").each((_, el) => {
                let link = ($(el).attr("href") || "").trim();
                if (!link || seen.has(link))
                    return;
                seen.add(link);
                if (link.startsWith("/"))
                    link = BASE + link;
                const title = ($(el).attr("title") || $(el).text() || "Untitled").trim();
                let image = $(el).find("img").attr("src") || "";
                if (image.startsWith("//"))
                    image = "https:" + image;
                posts.push({ title, link, image });
            });
            return posts.slice(0, 50);
        }
        catch (_b) {
            return [];
        }
    });
}
