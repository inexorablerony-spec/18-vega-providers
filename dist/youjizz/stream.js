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
const getStream = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ link, providerContext }) {
        if (!link)
            return [];
        const streams = [];
        const headers = { "User-Agent": UA, Referer: REFERER };
        // Direct MP4
        if (/\.mp4(\?|$)/i.test(link)) {
            streams.push({ server: "YouJizz", link, type: "mp4", headers });
            return streams;
        }
        try {
            const axios = providerContext === null || providerContext === void 0 ? void 0 : providerContext.axios;
            if (!axios)
                return [];
            const res = yield axios.get(link, { headers, timeout: 20000 });
            const html = res.data || "";
            const sources = extractSources(html);
            const seen = new Set();
            for (const source of sources) {
                let url = source.filename;
                if (url.startsWith("//"))
                    url = "https:" + url;
                if (seen.has(url))
                    continue;
                seen.add(url);
                streams.push({
                    server: `YouJizz ${source.name}`,
                    link: url,
                    type: "mp4",
                    headers,
                });
            }
        }
        catch (_b) { }
        return streams;
    });
};
exports.getStream = getStream;
