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
exports.getStream = void 0;
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
const REFERER = "https://noodlemagazine.com/";
const BASE = "https://adult.noodlemagazine.com";
function extractPlaylist(html) {
    const start = html.indexOf("window.playlist");
    if (start === -1)
        return null;
    const eq = html.indexOf("=", start);
    if (eq === -1)
        return null;
    let i = eq + 1;
    while (i < html.length && /\s/.test(html[i]))
        i++;
    if (html[i] !== "{")
        return null;
    let depth = 0;
    const braceStart = i;
    for (; i < html.length; i++) {
        if (html[i] === "{")
            depth++;
        else if (html[i] === "}") {
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
function resolve(file) {
    if (!file)
        return "";
    if (/^https?:\/\//i.test(file))
        return file;
    if (file.startsWith("//"))
        return "https:" + file;
    if (file.startsWith("/"))
        return BASE + file;
    return BASE + "/" + file;
}
const getStream = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ link, providerContext }) {
        if (!link)
            return [];
        const streams = [];
        try {
            const axios = providerContext === null || providerContext === void 0 ? void 0 : providerContext.axios;
            if (!axios)
                return [];
            const res = yield axios.get(link, { headers: { "User-Agent": UA, Referer: REFERER }, timeout: 20000 });
            const playlist = extractPlaylist(res.data || "");
            if (!playlist || !Array.isArray(playlist.sources))
                return [];
            for (const s of playlist.sources) {
                if (!s.file)
                    continue;
                const url = resolve(String(s.file));
                const label = s.label || "auto";
                const isHls = s.type === "hls" || /\.m3u8/i.test(url);
                streams.push({ server: `NT2 ${label}`, link: url, type: isHls ? "m3u8" : "mp4", headers: { "User-Agent": UA, Referer: REFERER } });
            }
        }
        catch (_b) { }
        return streams;
    });
};
exports.getStream = getStream;
