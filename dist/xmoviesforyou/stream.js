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
const BASE = "https://xmoviesforyou.com";
const REFERER = "https://xmoviesforyou.com/";
const getStream = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ link, providerContext }) {
        if (!link)
            return [];
        const streams = [];
        const headers = {
            "User-Agent": UA,
            "Referer": REFERER,
            "Origin": BASE,
            "Accept": "*/*"
        };
        if (/\.m3u8(\?|$)/i.test(link)) {
            streams.push({ server: "XMF HLS", link, type: "m3u8", headers });
            return streams;
        }
        if (/\.mp4(\?|$)/i.test(link)) {
            streams.push({ server: "XMF MP4", link, type: "mp4", headers });
            return streams;
        }
        try {
            const axios = providerContext === null || providerContext === void 0 ? void 0 : providerContext.axios;
            if (!axios)
                return [];
            const res = yield axios.get(link, { headers, timeout: 20000 });
            const html = res.data || "";
            const videoIdMatch = html.match(/videoId\s*=\s*"?(\d+)"?/);
            if (videoIdMatch) {
                const videoId = videoIdMatch[1];
                const streamRes = yield axios.get(`${BASE}/api/stream/${videoId}`, { headers, timeout: 10000 });
                const streamData = streamRes.data;
                if (streamData && streamData.url) {
                    streams.push({ server: "XMF HLS", link: streamData.url, type: "m3u8", headers });
                }
            }
        }
        catch (_b) { }
        return streams;
    });
};
exports.getStream = getStream;
