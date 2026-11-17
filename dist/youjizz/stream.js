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
const REFERER = "https://www.youjizz.com/";
function getQuality(url) {
    if (url.includes("1920-1080"))
        return "1080p";
    if (url.includes("1280-720"))
        return "720p";
    if (url.includes("852-480"))
        return "480p";
    if (url.includes("640-360"))
        return "360p";
    if (url.includes("426-240"))
        return "240p";
    return "Auto";
}
const getStream = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ link, providerContext }) {
        if (!link)
            return [];
        const streams = [];
        const headers = { "User-Agent": UA, Referer: REFERER };
        if (/\.mp4/i.test(link)) {
            streams.push({ server: "YouJizz", link, type: "mp4", headers });
            return streams;
        }
        try {
            const axios = providerContext === null || providerContext === void 0 ? void 0 : providerContext.axios;
            if (!axios)
                return [];
            const res = yield axios.get(link, { headers, timeout: 20000 });
            const html = res.data || "";
            const matches = html.match(/\/\/cdne-mobile\.youjizz\.com[^"'\s]+\.mp4[^"'\s]*/gi) || [];
            const seen = new Set();
            for (const url of matches) {
                const fullUrl = url.startsWith("//") ? "https:" + url.replace(/&amp;/g, "&") : url.replace(/&amp;/g, "&");
                if (seen.has(fullUrl))
                    continue;
                seen.add(fullUrl);
                const quality = getQuality(fullUrl);
                streams.push({ server: `YouJizz ${quality}`, link: fullUrl, type: "mp4", headers });
            }
        }
        catch (_b) { }
        return streams;
    });
};
exports.getStream = getStream;
