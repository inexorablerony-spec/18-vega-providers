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
exports.getSearchPosts = exports.getPosts = void 0;
const BASE = "https://sxyprn.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function parse(html, cheerio) {
    const $ = cheerio.load(html || "");
    const posts = [];
    const seen = {};
    $("a.post_time[href*='/post/']").each(function (_, el) {
        const $el = $(el);
        let link = ($el.attr("href") || "").split("?")[0];
        if (!link || link.indexOf("/post/") < 0) return;
        if (link.indexOf("/") === 0) link = BASE + link;
        if (seen[link]) return;
        seen[link] = true;
        let title = $el.attr("title") || $el.text().trim() || "Video";
        title = title.replace(/\{[^}]*\}/g, "").replace(/https?:\/\/\S+/g, "").trim();
        const $card = $el.closest("div").parent();
        let image = $card.find("img").attr("data-src") || $card.find("img").attr("src") || "";
        if (image.indexOf("//") === 0) image = "https:" + image;
        else if (image.indexOf("/") === 0) image = BASE + image;
        if (title.length > 3) posts.push({ title: title.slice(0, 140), link: link, image: image });
    });
    return posts.slice(0, 40);
}
const getPosts = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ page = 1, filter, signal, providerContext }) {
        try {
            const axios = providerContext.axios;
            const cheerio = providerContext.cheerio;
            const f = (filter || "trending").toLowerCase();
            let path = "/trending.html";
            if (f === "new") path = "/new.html";
            else if (f === "latest") path = "/latest.html";
            else if (f === "popular") path = "/popular.html";
            const url = BASE + path + "?page=" + (page || 1);
            const res = yield axios.get(url, { headers: { "User-Agent": UA, Referer: BASE + "/" }, signal: signal, timeout: 20000 });
            return parse(res.data, cheerio);
        } catch (e) { return []; }
    });
};
exports.getPosts = getPosts;
const getSearchPosts = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ searchQuery, page = 1, signal, providerContext }) {
        try {
            const axios = providerContext.axios;
            const cheerio = providerContext.cheerio;
            const url = BASE + "/search.html?q=" + encodeURIComponent(searchQuery) + "&page=" + (page || 1);
            const res = yield axios.get(url, { headers: { "User-Agent": UA, Referer: BASE + "/" }, signal: signal, timeout: 20000 });
            return parse(res.data, cheerio);
        } catch (e) { return []; }
    });
};
exports.getSearchPosts = getSearchPosts;
