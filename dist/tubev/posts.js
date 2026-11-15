// @vega-provider tubev
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
const BASE = "https://www.tubev.sex";
const H = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36", Accept: "text/html", Referer: BASE + "/" };
function getPosts(_a) {
    return __awaiter(this, arguments, void 0, function* ({ filter, page = 1, signal, providerContext }) {
        try {
            const { axios, cheerio } = providerContext;
            let url = BASE + "/";
            if (filter)
                url = BASE + "/" + filter.replace(/^\//, "") + "/";
            if (page > 1)
                url += (url.includes("?") ? "&" : "?") + "page=" + page;
            const res = yield axios.get(url, { headers: H, signal, timeout: 20000 });
            const $ = cheerio.load(res.data || "");
            const seen = new Set();
            const posts = [];
            $("a[href*='/video'], a[href*='/videos/'], a[href*='/v/']").each((_, el) => {
                let link = ($(el).attr("href") || "").trim();
                if (!link)
                    return;
                if (link.startsWith("//"))
                    link = "https:" + link;
                else if (link.startsWith("/"))
                    link = BASE + link;
                if (!/\/(video|videos|v)\//.test(link) || seen.has(link))
                    return;
                if (/\/(categories|tags|models|channels|search)\//i.test(link))
                    return;
                const title = ($(el).attr("title") || $(el).find("img").attr("alt") || $(el).text() || "Untitled").trim();
                let image = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || "";
                if (image.startsWith("//"))
                    image = "https:" + image;
                seen.add(link);
                posts.push({ title, link, image });
            });
            return posts.slice(0, 80);
        }
        catch (_b) {
            return [];
        }
    });
}
function getSearchPosts(_a) {
    return __awaiter(this, arguments, void 0, function* ({ searchQuery, page = 1, signal, providerContext }) {
        return getPosts({ filter: "search/" + encodeURIComponent(searchQuery), page, signal, providerContext });
    });
}
