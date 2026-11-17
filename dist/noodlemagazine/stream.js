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
const REFERER = "https://noodlemagazine.tv/";
const getStream = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ link, providerContext }) {
        if (!link)
            return [];
        const streams = [];
        const headers = { "User-Agent": UA, Referer: REFERER };
        // Direct MP4/M3U8
        if (/\.(mp4|m3u8)(\?|$)/i.test(link)) {
            streams.push({ server: "Noodle", link, type: /\.m3u8/i.test(link) ? "m3u8" : "mp4", headers });
            return streams;
        }
        try {
            const axios = providerContext === null || providerContext === void 0 ? void 0 : providerContext.axios;
            if (!axios)
                return [];
            const res = yield axios.get(link, { headers, timeout: 20000 });
            const html = res.data || "";
            // 1. Direct MP4/M3U8 in HTML
            const mp4Matches = html.match(/https?:\/\/[^"'\s]+\.mp4[^"'\s]*/gi) || [];
            const m3u8Matches = html.match(/https?:\/\/[^"'\s]+\.m3u8[^"'\s]*/gi) || [];
            for (const url of [...new Set([...mp4Matches, ...m3u8Matches])]) {
                if (!url.includes("preview") && !url.includes("thumb")) {
                    streams.push({ server: "Noodle", link: url, type: url.includes(".m3u8") ? "m3u8" : "mp4", headers });
                }
            }
            // 2. Embed URL
            const embedMatch = html.match(/embedUrl["']?\s*:\s*["']([^"']+)["']/i);
            if (embedMatch && streams.length === 0) {
                const embedUrl = embedMatch[1].replace(/\\\//g, "/");
                if (embedUrl && !embedUrl.includes("adtng")) {
                    // Return embed URL as stream (player will handle it)
                    streams.push({ server: "Noodle Embed", link: embedUrl, type: "mp4", headers });
                    // Also try to extract streams from embed
                    try {
                        const embedRes = yield axios.get(embedUrl, { headers, timeout: 15000 });
                        const embedHtml = embedRes.data || "";
                        const embedMp4 = embedHtml.match(/https?:\/\/[^"'\s]+\.mp4[^"'\s]*/gi) || [];
                        const embedM3u8 = embedHtml.match(/https?:\/\/[^"'\s]+\.m3u8[^"'\s]*/gi) || [];
                        for (const url of [...new Set([...embedMp4, ...embedM3u8])]) {
                            streams.push({ server: "Noodle", link: url, type: url.includes(".m3u8") ? "m3u8" : "mp4", headers });
                        }
                    }
                    catch (_b) { }
                }
            }
            // 3. window.playlist
            const playlistMatch = html.match(/window\.playlist\s*=\s*(\{[\s\S]*?\});/);
            if (playlistMatch && streams.length === 0) {
                try {
                    const playlist = JSON.parse(playlistMatch[1]);
                    if (playlist.sources) {
                        for (const source of playlist.sources) {
                            if (source.file) {
                                const url = source.file.startsWith("//") ? "https:" + source.file : source.file;
                                streams.push({ server: "Noodle", link: url, type: url.includes(".m3u8") ? "m3u8" : "mp4", headers });
                            }
                        }
                    }
                }
                catch (_c) { }
            }
        }
        catch (_d) { }
        return streams;
    });
};
exports.getStream = getStream;
