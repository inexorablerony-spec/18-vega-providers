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
const REFERER = "https://noodlemagazine.com/";
function extractPlaylist(html) {
    const marker = "window.playlist";
    const start = html.indexOf(marker);
    if (start === -1)
        return null;
    const braceStart = html.indexOf("{", start);
    if (braceStart === -1)
        return null;
    let depth = 0;
    let inString = false;
    let escape = false;
    for (let i = braceStart; i < html.length; i++) {
        const c = html[i];
        if (escape) {
            escape = false;
            continue;
        }
        if (c === "\\") {
            escape = true;
            continue;
        }
        if (c === '"') {
            inString = !inString;
            continue;
        }
        if (inString)
            continue;
        if (c === "{")
            depth++;
        if (c === "}") {
            depth--;
            if (depth === 0) {
                try {
                    return JSON.parse(html.slice(braceStart, i + 1));
                }
                catch (_a) {
                    return null;
                }
            }
        }
    }
    return null;
}
function resolveUrl(file) {
    if (file.startsWith("http"))
        return file;
    if (file.startsWith("//"))
        return "https:" + file;
    if (file.startsWith("/"))
        return BASE + file;
    return BASE + "/" + file;
}
const getMeta = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ link, providerContext }) {
        var _b, _c;
        try {
            const { axios } = providerContext;
            const res = yield axios.get(link, { headers: { "User-Agent": UA, Referer: REFERER }, timeout: 15000 });
            const html = res.data || "";
            const title = ((_b = html.match(/<title[^>]*>(.*?)<\/title>/i)) === null || _b === void 0 ? void 0 : _b[1]) || "Noodle Test 1";
            const image = ((_c = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i)) === null || _c === void 0 ? void 0 : _c[1]) || "";
            const linkList = [];
            const playlist = extractPlaylist(html);
            if (playlist && Array.isArray(playlist.sources)) {
                for (const source of playlist.sources) {
                    if (source.file) {
                        const url = resolveUrl(String(source.file));
                        const quality = source.label || "Auto";
                        linkList.push({ title: quality, quality, directLinks: [{ title: quality, link: url, type: url.includes(".m3u8") ? "m3u8" : "mp4" }] });
                    }
                }
            }
            return { title, synopsis: "", image, imdbId: "", type: "movie", linkList };
        }
        catch (_d) {
            return { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
        }
    });
};
exports.getMeta = getMeta;
