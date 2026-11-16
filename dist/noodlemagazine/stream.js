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
                headers: { "User-Agent": UA, Referer: "https://noodlemagazine.com/" },
                timeout: 20000,
            });
            const html = res.data || "";
            // Source tags
            const sourceRe = /<source[^>]+src=["']([^"']+)["'][^>]*(?:title=["']([^"']+)["'])?[^>]*>/gi;
            let m;
            while ((m = sourceRe.exec(html)) !== null) {
                let src = m[1];
                const quality = m[2] || "auto";
                if (src.startsWith("//"))
                    src = "https:" + src;
                if (src.startsWith("/"))
                    src = "https://noodlemagazine.com" + src;
                if (src.includes(".mp4") || src.includes(".m3u8")) {
                    streams.push({
                        server: `Noodle ${quality}`,
                        link: src,
                        type: src.includes(".m3u8") ? "m3u8" : "mp4",
                        headers: { "User-Agent": UA, Referer: "https://noodlemagazine.com/" },
                    });
                }
            }
            // Direct mp4/m3u8 in page
            if (streams.length === 0) {
                const media = html.match(/https?:\/\/[^"'\s]+\.(?:mp4|m3u8)[^"'\s]*/gi) || [];
                const unique = [...new Set(media)];
                for (const u of unique) {
                    streams.push({
                        server: "Noodle Magazine",
                        link: u,
                        type: u.includes(".m3u8") ? "m3u8" : "mp4",
                        headers: { "User-Agent": UA, Referer: "https://noodlemagazine.com/" },
                    });
                }
            }
        }
        catch (_b) { }
        return streams;
    });
};
exports.getStream = getStream;
