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
                headers: { "User-Agent": UA, Referer: "https://www.wowxxx.to/" },
                timeout: 20000,
            });
            const html = res.data || "";
            // Extract get_file MP4s
            const mp4Re = /https?:\/\/[^"'\s]+get_file[^"'\s]+\.mp4[^"'\s]*/gi;
            const matches = html.match(mp4Re) || [];
            const unique = [...new Set(matches)];
            for (const url of unique) {
                let quality = "auto";
                const fnMatch = url.match(/download_filename=[^&]*_(\d+)[a-z]?\.mp4/i);
                if (fnMatch)
                    quality = fnMatch[1] + "p";
                else if (url.includes("_720"))
                    quality = "720p";
                else if (url.includes("_1080"))
                    quality = "1080p";
                else if (url.includes("_480"))
                    quality = "480p";
                else if (url.includes("_360"))
                    quality = "360p";
                streams.push({
                    server: `WowXXX ${quality}`,
                    link: url,
                    type: "mp4",
                    headers: { "User-Agent": UA, Referer: "https://www.wowxxx.to/" },
                });
            }
            // Also check for source tags
            const sourceRe = /<source[^>]+src=["']([^"']+\.mp4[^"']*)["'][^>]*>/gi;
            let m;
            while ((m = sourceRe.exec(html)) !== null) {
                let src = m[1];
                if (src.startsWith("//"))
                    src = "https:" + src;
                if (!streams.some(s => s.link === src)) {
                    streams.push({
                        server: "WowXXX",
                        link: src,
                        type: "mp4",
                        headers: { "User-Agent": UA, Referer: "https://www.wowxxx.to/" },
                    });
                }
            }
        }
        catch (_b) { }
        return streams;
    });
};
exports.getStream = getStream;
