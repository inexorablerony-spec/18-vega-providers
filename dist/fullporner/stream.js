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
const UA = "Mozilla/5.0";
const REFERER = "https://fullporner.com/";
const getStream = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ link, providerContext }) {
        if (!link)
            return [];
        const streams = [];
        const headers = { "User-Agent": UA, Referer: REFERER };
        if (/\.mp4/i.test(link) || /\.m3u8/i.test(link)) {
            streams.push({ server: "FullPorner", link, type: /\.m3u8/i.test(link) ? "m3u8" : "mp4", headers });
            return streams;
        }
        try {
            const axios = providerContext === null || providerContext === void 0 ? void 0 : providerContext.axios;
            if (!axios)
                return [];
            const res = yield axios.get(link, { headers, timeout: 20000 });
            const html = res.data || "";
            const embedMatch = html.match(/iframe[^>]+src="([^"]*player[^"]+)"/i);
            if (embedMatch) {
                const embedUrl = embedMatch[1].startsWith("//") ? "https:" + embedMatch[1] : embedMatch[1];
                const embedRes = yield axios.get(embedUrl, { headers, timeout: 15000 });
                const embedHtml = embedRes.data || "";
                const mp4Match = embedHtml.match(/https?:\/\/[^"'\s]+\.mp4[^"'\s]*/gi) || [];
                const m3u8Match = embedHtml.match(/https?:\/\/[^"'\s]+\.m3u8[^"'\s]*/gi) || [];
                for (const url of [...new Set([...mp4Match, ...m3u8Match])]) {
                    streams.push({ server: "FullPorner", link: url, type: url.includes(".m3u8") ? "m3u8" : "mp4", headers });
                }
            }
        }
        catch (_b) { }
        return streams;
    });
};
exports.getStream = getStream;
