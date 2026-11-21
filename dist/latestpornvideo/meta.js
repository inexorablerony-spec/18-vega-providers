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
function unpack(html) {
    const idx = html.indexOf("function(p,a,c,k,e,d)");
    if (idx < 0) return "";
    const start = html.indexOf("}('", idx);
    const end = html.indexOf(".split('|')", start);
    if (start < 0 || end < 0) return "";
    const chunk = html.slice(start + 3, end);
    const m = chunk.match(/',(\d+),(\d+),'/);
    if (!m) return "";
    let p = chunk.slice(0, m.index);
    const a = parseInt(m[1], 10);
    const c = parseInt(m[2], 10);
    const k = chunk.slice(m.index + m[0].length).split("|");
    const toBase = function (n, base) {
        if (n === 0) return "0";
        const digits = "0123456789abcdefghijklmnopqrstuvwxyz";
        let result = "";
        while (n) { result = digits[n % base] + result; n = Math.floor(n / base); }
        return result;
    };
    for (let i = Math.min(c, k.length) - 1; i >= 0; i--) {
        if (k[i]) p = p.replace(new RegExp("\\b" + toBase(i, a) + "\\b", "g"), k[i]);
    }
    return p;
}
const getMeta = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ link, providerContext }) {
        const empty = { title: "Untitled", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
        try {
            const axios = providerContext.axios;
            const cheerio = providerContext.cheerio;
            const res = yield axios.get(link, { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://latestpornvideo.com/" }, timeout: 20000 });
            const html = String(res.data || "");
            const $ = cheerio.load(html);
            const title = $("h1").first().text().trim() || $("title").text().trim() || "Untitled";
            const image = $('meta[property="og:image"]').attr("content") || "";
            const directLinks = [];
            const iframeMatch = html.match(/iframe[^>]+src=["']([^"']+)["']/i);
            const iframe = iframeMatch ? iframeMatch[1] : "";
            if (iframe) {
                const embed = yield axios.get(iframe, { headers: { "User-Agent": "Mozilla/5.0", Referer: link }, timeout: 15000 });
                const unpacked = unpack(String(embed.data || ""));
                const m3u8Match = unpacked.match(/https?:\/\/[^"'\s]+\.m3u8[^"'\s]*/i);
                if (m3u8Match) directLinks.push({ title: "HLS", link: m3u8Match[0], type: "m3u8" });
            }
            if (directLinks.length === 0) directLinks.push({ title: "Play", link: link, type: "mp4" });
            return { title: title, synopsis: "", image: image, imdbId: "", type: "movie", linkList: [{ title: "Play", quality: "HLS", directLinks: directLinks }] };
        } catch (e) { return empty; }
    });
};
exports.getMeta = getMeta;
