// @vega-provider xvideos
// @vega-version 1.0
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
const BASE = "https://www.xvideos.com";
const H = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36", Accept: "text/html" };
function getPosts(_a) {
    return __awaiter(this, arguments, void 0, function* ({ filter, page = 1, signal, providerContext }) {
        try {
            const { axios, cheerio } = providerContext;
            const url = BASE + "/" + (page > 1 ? "?page=" + page : "");
            const res = yield axios.get(url, { headers: H, signal, timeout: 20000 });
            const $ = cheerio.load(res.data || "");
            const posts = [];
            $(".thumb-block").each((_, el) => {
                const a = $(el).is("a") ? $(el) : $(el).find("a").first();
                let link = (a.attr("href") || "").trim();
                if (!link || !link.includes("/video"))
                    return;
                if (link.startsWith("/"))
                    link = BASE + link;
                const title = ($(el).find(".title, h3, .album-title").text() || a.attr("title") || a.find("img").attr("alt") || "Untitled").trim();
                let image = a.find("img").attr("data-src") || a.find("img").attr("src") || "";
                if (image.startsWith("//"))
                    image = "https:" + image;
                posts.push({ title, link, image });
            });
            return posts.slice(0, 60);
        }
        catch (_b) {
            return [];
        }
    });
}
function getSearchPosts(_a) {
    return __awaiter(this, arguments, void 0, function* ({ searchQuery, page = 1, signal, providerContext }) {
        return getPosts({ filter: "", page, signal, providerContext });
    });
}
