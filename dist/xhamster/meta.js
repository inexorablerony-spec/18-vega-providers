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
exports.getMeta = void 0;
const getMeta = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ link, providerContext }) {
        const empty = { title: "Untitled", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
        try {
            const axios = providerContext.axios;
            const cheerio = providerContext.cheerio;
            const res = yield axios.get(link, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    Referer: "https://xhamster.com/",
                    Accept: "text/html,application/xhtml+xml",
                },
                timeout: 25000,
            });
            const html = String(res.data || "").replace(/\\\//g, "/");
            const $ = cheerio.load(html);
            const title = String($("h1").first().text() || $('meta[property="og:title"]').attr("content") || $("title").text() || "Untitled").trim();
            const image = String($('meta[property="og:image"]').attr("content") || "");
            const directLinks = [];
            const m3u8 = html.match(/https:\/\/[a-z0-9.\-]*xhcdn\.com\/[^"'\s]+?\.m3u8/gi) || [];
            for (let i = 0; i < m3u8.length; i++) {
                const u = m3u8[i];
                if (!directLinks.find(function (d) { return d.link === u; })) directLinks.push({ title: "HLS", link: u, type: "m3u8" });
            }
            const mp4 = html.match(/https:\/\/[a-z0-9.\-]*xhcdn\.com\/[^"'\s]+?\.mp4/gi) || [];
            for (let i = 0; i < mp4.length; i++) {
                const u = mp4[i];
                if (!/preview|thumb|sprite/i.test(u) && !directLinks.find(function (d) { return d.link === u; })) {
                    directLinks.push({ title: "MP4", link: u, type: "mp4" });
                }
            }
            if (directLinks.length === 0) {
                directLinks.push({ title: "Play", link: link, type: "mp4" });
            }
            const linkList = [{ title: "Play", quality: directLinks[0].title || "HD", directLinks: directLinks }];
            return { title: title, synopsis: "", image: image, imdbId: "", type: "movie", linkList: linkList };
        } catch (e) { return empty; }
    });
};
exports.getMeta = getMeta;
