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
const BASE = "https://fullporner.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
function parse(html, cheerio) {
    const $ = cheerio.load(html || "");
    const posts = [];
    const seen = {};
    $(".video-card").each(function (_, el) {
        const $card = $(el);
        const $a = $card.find("a[href^='/watch/']").first();
        let link = ($a.attr("href") || "").split("?")[0];
        if (!link) return;
        link = BASE + link;
        if (seen[link]) return;
        seen[link] = true;
        const title = $a.find("img").attr("alt") || $card.find(".video-title").text().trim() || "Video";
        let image = $a.find("img").attr("data-src") || $a.find("img").attr("src") || "";
        if (image.indexOf("//") === 0) image = "https:" + image;
        if (title.length > 2) posts.push({ title: title.trim().slice(0, 140), link: link, image: image });
    });
    return posts.slice(0, 40);
}
const getPosts = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ page = 1, signal, providerContext }) {
        try {
            const axios = providerContext.axios;
            const cheerio = providerContext.cheerio;
            const url = page > 1 ? BASE + "/home/" + page : BASE + "/";
            const res = yield axios.get(url, { headers: { "User-Agent": UA, Referer: BASE + "/" }, signal: signal, timeout: 20000 });
            return parse(res.data, cheerio);
        } catch (e) { return []; }
    });
};
exports.getPosts = getPosts;
const getSearchPosts = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ searchQuery, signal, providerContext }) {
        try {
            const axios = providerContext.axios;
            const cheerio = providerContext.cheerio;
            const url = BASE + "/search?q=" + encodeURIComponent(searchQuery);
            const res = yield axios.get(url, { headers: { "User-Agent": UA, Referer: BASE + "/" }, signal: signal, timeout: 20000 });
            return parse(res.data, cheerio);
        } catch (e) { return []; }
    });
};
exports.getSearchPosts = getSearchPosts;
