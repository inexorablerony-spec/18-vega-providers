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
const REFERER = "https://www.porn00.org/";
const getStream = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ link, providerContext }) {
        if (!link)
            return [];
        const streams = [];
        const headers = { "User-Agent": UA, Referer: REFERER };
        if (/\.mp4/i.test(link)) {
            const quality = link.includes("720") ? "720p" : link.includes("1080") ? "1080p" : "Auto";
            streams.push({ server: `Porn00 ${quality}`, link, type: "mp4", headers });
            return streams;
        }
        try {
            const axios = providerContext === null || providerContext === void 0 ? void 0 : providerContext.axios;
            if (!axios)
                return [];
            const res = yield axios.get(link, { headers, timeout: 20000 });
            const html = res.data || "";
            const mp4Matches = html.match(/https?:\/\/[^"'\s]+\.mp4[^"'\s]*/gi) || [];
            const seen = new Set();
            for (const url of [...new Set(mp4Matches)]) {
                if (!url.includes("preview") && !url.includes("thumb") && !seen.has(url)) {
                    seen.add(url);
                    const quality = url.includes("720") ? "720p" : url.includes("1080") ? "1080p" : "Auto";
                    streams.push({ server: `Porn00 ${quality}`, link: url, type: "mp4", headers });
                }
            }
        }
        catch (_b) { }
        return streams;
    });
};
exports.getStream = getStream;
