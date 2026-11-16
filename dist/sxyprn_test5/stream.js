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
const REFERER = "https://sxyprn.com/";
const BASE = "https://sxyprn.com";
const getStream = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ link, providerContext }) {
        if (!link)
            return [];
        const streams = [];
        const seen = new Set();
        const headers = { "User-Agent": UA, Referer: REFERER };
        try {
            const axios = providerContext === null || providerContext === void 0 ? void 0 : providerContext.axios;
            if (!axios)
                return [];
            const res = yield axios.get(link, { headers, timeout: 20000 });
            const html = res.data || "";
            const vnfoMatch = html.match(/data-vnfo=['"]([^'"]+)['"]/);
            if (vnfoMatch) {
                try {
                    const data = JSON.parse(vnfoMatch[1].replace(/&quot;/g, '"'));
                    for (const path of Object.values(data)) {
                        if (typeof path !== "string")
                            continue;
                        let url = path;
                        if (url.startsWith("/"))
                            url = BASE + url;
                        else if (!url.startsWith("http"))
                            url = BASE + "/" + url;
                        if (!seen.has(url)) {
                            seen.add(url);
                            streams.push({ server: "SP5 VNFO", link: url, type: "mp4", headers });
                        }
                    }
                }
                catch (_b) { }
            }
            const matches = html.match(/https?:\\?\/\\?\/[^"'\\\s]+\.(?:mp4|m3u8)[^"'\\\s]*/gi) || [];
            for (const u of matches) {
                const url = u.replace(/\\\//g, "/");
                if (url.includes("thumb") || seen.has(url))
                    continue;
                seen.add(url);
                streams.push({ server: "SP5", link: url, type: /\.m3u8/i.test(url) ? "m3u8" : "mp4", headers });
            }
        }
        catch (_c) { }
        return streams;
    });
};
exports.getStream = getStream;
