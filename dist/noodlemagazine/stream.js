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
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const BASE = "https://adult.noodlemagazine.com";
function extractPlaylist(html) {
    const marker = "window.playlist";
    const start = html.indexOf(marker);
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
        const ch = html[i];
        if (ch === "{")
            depth++;
        else if (ch === "}") {
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
    return __awaiter(this, arguments, void 0, function* ({ link, providerContext, }) {
        if (!link)
            return [];
        const streams = [];
        try {
            const axios = providerContext === null || providerContext === void 0 ? void 0 : providerContext.axios;
            if (!axios)
                return [];
            const res = yield axios.get(link, {
                headers: {
                    "User-Agent": UA,
                    Referer: "https://noodlemagazine.com/",
                    Accept: "text/html,application/xhtml+xml",
                },
                timeout: 25000,
            });
            const html = res.data || "";
            const playlist = extractPlaylist(html);
            if (playlist && Array.isArray(playlist.sources)) {
                for (const source of playlist.sources) {
                    const file = source && source.file;
                    if (!file)
                        continue;
                    const url = resolveUrl(String(file));
                    const label = (source.label && String(source.label)) || "auto";
                    const isHls = source.type === "hls" || /\.m3u8/i.test(url);
                    streams.push({
                        server: `Noodle ${label}`,
                        link: url,
                        type: isHls ? "m3u8" : "mp4",
                        headers: { "User-Agent": UA, Referer: "https://noodlemagazine.com/" },
                    });
                }
            }
            // Fallback: source tags if playlist missing
            if (streams.length === 0) {
                const sourceRe = /<source[^>]+src=["']([^"']+)["'][^>]*>/gi;
                let m;
                while ((m = sourceRe.exec(html)) !== null) {
                    let src = m[1];
                    if (src.startsWith("//"))
                        src = "https:" + src;
                    if (src.startsWith("/"))
                        src = "https://noodlemagazine.com" + src;
                    if (/\.(mp4|m3u8)/i.test(src)) {
                        streams.push({
                            server: "Noodle Magazine",
                            link: src,
                            type: /\.m3u8/i.test(src) ? "m3u8" : "mp4",
                            headers: { "User-Agent": UA, Referer: "https://noodlemagazine.com/" },
                        });
                    }
                }
            }
        }
        catch (_b) { }
        return streams;
    });
};
exports.getStream = getStream;
