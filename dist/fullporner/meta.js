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
const QUALITY = { 1: "360", 2: "480", 4: "720", 8: "1080" };
function follow(url, axios) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield axios.get(url, {
                headers: { "User-Agent": "Mozilla/5.0", Referer: "https://fullporner.com/" },
                maxRedirects: 5,
                timeout: 10000,
            });
            return (res.request && res.request.res && res.request.res.responseUrl) || (res.config && res.config.url) || url;
        } catch (e) { return url; }
    });
}
const getMeta = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ link, providerContext }) {
        const empty = { title: "Untitled", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
        try {
            const axios = providerContext.axios;
            const cheerio = providerContext.cheerio;
            const res = yield axios.get(link, { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://fullporner.com/" }, timeout: 20000 });
            const html = String(res.data || "");
            const $ = cheerio.load(html);
            const title = $("h1").first().text().trim() || $("title").text().trim() || "Untitled";
            const image = $('meta[property="og:image"]').attr("content") || "";
            const directLinks = [];
            const iframeMatch = html.match(/iframe[^>]+src=["']([^"']+)["']/i);
            const iframe = iframeMatch ? iframeMatch[1] : "";
            const m = iframe.match(/\/(?:video|player)\/([a-z0-9]+)\/(\d+)/i);
            if (m) {
                const mediaId = m[1].split("").reverse().join("");
                const mask = parseInt(m[2], 10);
                const bits = [8, 4, 2, 1];
                for (let i = 0; i < bits.length; i++) {
                    if (mask & bits[i]) {
                        const q = QUALITY[bits[i]];
                        const raw = "https://xiaoshenke.net/vid/" + mediaId + "/" + q;
                        const final = yield follow(raw, axios);
                        directLinks.push({ title: q + "p", link: final, type: "mp4" });
                    }
                }
            }
            if (directLinks.length === 0) directLinks.push({ title: "Play", link: link, type: "mp4" });
            const linkList = [{ title: "Play", quality: (directLinks[0] && directLinks[0].title) || "HD", directLinks: directLinks }];
            return { title: title, synopsis: "", image: image, imdbId: "", type: "movie", linkList: linkList };
        } catch (e) { return empty; }
    });
};
exports.getMeta = getMeta;
