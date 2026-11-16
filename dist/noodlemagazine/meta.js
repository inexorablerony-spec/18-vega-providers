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
const BASE = "https://adult.noodlemagazine.com";
function extractPlaylist(html) {
    const start = html.indexOf("window.playlist");
    if (start === -1)
        return null;
    const eq = html.indexOf("=", start);
    if (eq === -1)
        return null;
    const brace = html.indexOf("{", eq);
    if (brace === -1)
        return null;
    let depth = 0;
    let end = brace;
    for (let i = brace; i < html.length; i++) {
        if (html[i] === "{")
            depth++;
        else if (html[i] === "}") {
            depth--;
            if (depth === 0) {
                end = i + 1;
                break;
            }
        }
    }
    try {
        return JSON.parse(html.slice(brace, end));
    }
    catch (_a) {
        return null;
    }
}
function resolveUrl(file) {
    if (!file)
        return "";
    if (file.startsWith("http"))
        return file;
    if (file.startsWith("//"))
        return "https:" + file;
    if (file.startsWith("/"))
        return BASE + file;
    return BASE + "/" + file;
}
const getMeta = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ link, providerContext, }) {
        var _b, _c;
        try {
            const { axios } = providerContext;
            const res = yield axios.get(link, {
                headers: { "User-Agent": UA, Referer: BASE + "/" },
                timeout: 20000,
            });
            const html = res.data || "";
            const title = ((_b = html.match(/<title[^>]*>(.*?)<\/title>/i)) === null || _b === void 0 ? void 0 : _b[1]) || "Noodle Magazine";
            const image = ((_c = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i)) === null || _c === void 0 ? void 0 : _c[1]) || "";
            const playlist = extractPlaylist(html);
            const linkList = [];
            if (playlist && Array.isArray(playlist.sources)) {
                for (const source of playlist.sources) {
                    const file = source.file;
                    if (!file)
                        continue;
                    const url = resolveUrl(file);
                    const label = source.label || "auto";
                    const isHls = source.type === "hls" || url.includes(".m3u8");
                    linkList.push({
                        title: label,
                        quality: label,
                        directLinks: [{ title: label, link: url, type: isHls ? "m3u8" : "mp4" }],
                    });
                }
            }
            return {
                title,
                synopsis: "",
                image,
                imdbId: "",
                type: "movie",
                linkList,
            };
        }
        catch (_d) {
            return { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
        }
    });
};
exports.getMeta = getMeta;
