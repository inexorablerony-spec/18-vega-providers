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
const BASE = "https://www.eporner.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
function fromApi(axios, url, signal) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield axios.get(url, { headers: { "User-Agent": UA, Accept: "application/json" }, signal, timeout: 20000 });
            let data = res.data;
            if (typeof data === "string") {
                try {
                    data = JSON.parse(data);
                }
                catch (_a) {
                    return [];
                }
            }
            const videos = (data && data.videos) || [];
            return videos.map((v) => ({
                title: v.title || "Untitled",
                link: v.url || `${BASE}/video-${v.id}/`,
                image: (v.default_thumb && v.default_thumb.src) || "",
            }));
        }
        catch (_b) {
            return [];
        }
    });
}
function fromHtml(axios, cheerio, url, signal) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield axios.get(url, { headers: { "User-Agent": UA }, signal, timeout: 25000 });
            const $ = cheerio.load(res.data || "");
            const posts = [];
            const seen = new Set();
            $(".mb").each((_, el) => {
                const $el = $(el);
                const $a = $el.find("a[href*='/video-']").first();
                let link = $a.attr("href") || "";
                if (!link || seen.has(link))
                    return;
                if (link.startsWith("/"))
                    link = BASE + link;
                seen.add(link);
                const title = $el.find(".mbtit a").first().text().trim() || $el.find("img").attr("alt") || "Video";
                const image = $el.find(".mbimg img").attr("src") || $el.find("img").attr("src") || "";
                if (title && link)
                    posts.push({ title, link, image });
            });
            return posts.slice(0, 30);
        }
        catch (_a) {
            return [];
        }
    });
}
function getPosts(_a) {
    return __awaiter(this, arguments, void 0, function* ({ page = 1, signal, providerContext }) {
        const { axios, cheerio } = providerContext;
        const apiPosts = yield fromApi(axios, `${BASE}/api/v2/video/search/?order=latest&per_page=30&page=${page}`, signal);
        if (apiPosts.length)
            return apiPosts;
        return fromHtml(axios, cheerio, page > 1 ? `${BASE}/page/${page}/` : BASE, signal);
    });
}
function getSearchPosts(_a) {
    return __awaiter(this, arguments, void 0, function* ({ searchQuery, page = 1, signal, providerContext }) {
        const { axios, cheerio } = providerContext;
        const apiPosts = yield fromApi(axios, `${BASE}/api/v2/video/search/?query=${encodeURIComponent(searchQuery)}&per_page=30&page=${page}`, signal);
        if (apiPosts.length)
            return apiPosts;
        return fromHtml(axios, cheerio, `${BASE}/search/${encodeURIComponent(searchQuery)}/${page}/`, signal);
    });
}
