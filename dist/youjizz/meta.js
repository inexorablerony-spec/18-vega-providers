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
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const REFERER = "https://www.youjizz.com/";
function extractSources(html) {
    const sources = [];
    const regex = /\{"quality":"(\d+)","filename":"([^"]+)"[^}]*"name":"([^"]+)"\}/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
        sources.push({
            quality: match[1],
            filename: match[2].replace(/\\\//g, "/").replace(/&amp;/g, "&"),
            name: match[3],
        });
    }
    return sources;
}
const getMeta = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ link, providerContext }) {
        var _b, _c;
        try {
            const { axios } = providerContext;
            const res = yield axios.get(link, { headers: { "User-Agent": UA, Referer: REFERER }, timeout: 15000 });
            const html = res.data || "";
            const title = ((_b = html.match(/<title[^>]*>(.*?)<\/title>/i)) === null || _b === void 0 ? void 0 : _b[1]) || "YouJizz";
            const image = ((_c = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i)) === null || _c === void 0 ? void 0 : _c[1]) || "";
            const fullImage = image.startsWith("//") ? "https:" + image : image;
            const linkList = [];
            const sources = extractSources(html);
            for (const source of sources) {
                let url = source.filename;
                if (url.startsWith("//"))
                    url = "https:" + url;
                linkList.push({
                    title: source.name,
                    quality: source.name,
                    directLinks: [{ title: source.name, link: url, type: "mp4" }],
                });
            }
            return { title, synopsis: "", image: fullImage, imdbId: "", type: "movie", linkList };
        }
        catch (_d) {
            return { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
        }
    });
};
exports.getMeta = getMeta;
