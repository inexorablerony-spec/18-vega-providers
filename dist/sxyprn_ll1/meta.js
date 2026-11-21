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
const BASE = "https://sxyprn.com";
function ssut51(s) {
    let sum = 0;
    for (let i = 0; i < s.length; i++) {
        const c = s.charCodeAt(i);
        if (c >= 48 && c <= 57) sum += c - 48;
    }
    return sum;
}
function base64url(str) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    const bytes = [];
    for (let i = 0; i < str.length; i++) bytes.push(str.charCodeAt(i));
    let out = "";
    for (let i = 0; i < bytes.length; i += 3) {
        const b1 = bytes[i] || 0;
        const b2 = bytes[i + 1] || 0;
        const b3 = bytes[i + 2] || 0;
        const n = (b1 << 16) | (b2 << 8) | b3;
        out += chars[(n >> 18) & 63];
        out += chars[(n >> 12) & 63];
        out += (i + 1 < bytes.length) ? chars[(n >> 6) & 63] : "=";
        out += (i + 2 < bytes.length) ? chars[n & 63] : "=";
    }
    return out.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, ".");
}
function resolveUrl(src) {
    if (!src || src.indexOf("/cdn/") !== 0) return null;
    const tmp = src.split("/");
    if (tmp.length < 8) return null;
    try {
        const s6 = ssut51(tmp[6]);
        const s7 = ssut51(tmp[7]);
        tmp[1] += "8/" + base64url(s6 + "-sxyprn.com-" + s7);
        tmp[5] = String(Number(tmp[5]) - s6 - s7);
        return BASE + tmp.join("/");
    } catch (e) { return null; }
}
const getMeta = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ link, providerContext }) {
        const empty = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
        try {
            const axios = providerContext.axios;
            const cheerio = providerContext.cheerio;
            const res = yield axios.get(link, { headers: { "User-Agent": "Mozilla/5.0", Referer: BASE + "/" }, timeout: 20000 });
            const html = String(res.data || "");
            const $ = cheerio.load(html);
            const title = $("title").text().replace(/ on the SexyPorn.*/i, "").replace(/ - sxyprn.*/i, "").trim() || "Untitled";
            let image = $('meta[property="og:image"]').attr("content") || $("img[data-src]").first().attr("data-src") || "";
            if (image.indexOf("//") === 0) image = "https:" + image;
            const m = html.match(/data-vnfo='([^']+)'/);
            const directLinks = [];
            if (m) {
                try {
                    const vnfo = JSON.parse(m[1]);
                    const keys = Object.keys(vnfo || {});
                    for (let k = 0; k < keys.length; k++) {
                        const src = vnfo[keys[k]];
                        if (typeof src !== "string") continue;
                        const url = resolveUrl(src);
                        if (url) directLinks.push({ title: "HD", link: url, type: "mp4" });
                    }
                } catch (e) {}
            }
            const linkList = directLinks.length ? [{ title: "Play", quality: "HD", directLinks: directLinks }] : [];
            return { title: title, synopsis: "", image: image, imdbId: "", type: "movie", linkList: linkList };
        } catch (e) { return empty; }
    });
};
exports.getMeta = getMeta;
