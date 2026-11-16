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
const REFERER = "https://noodlemagazine.com/";
const getStream = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ link, providerContext }) {
        if (!link)
            return [];
        const streams = [];
        try {
            const axios = providerContext === null || providerContext === void 0 ? void 0 : providerContext.axios;
            if (!axios)
                return [];
            const res = yield axios.get(link, { headers: { "User-Agent": UA, Referer: REFERER }, timeout: 20000 });
            const html = res.data || "";
            const matches = html.match(/https?:\\?\/\\?\/[^"'\\\s]+\.(?:mp4|m3u8)[^"'\\\s]*/gi) || [];
            const unique = [...new Set(matches.map((u) => u.replace(/\\\//g, "/")))];
            for (const url of unique) {
                if (url.includes("preview") || url.includes("thumb"))
                    continue;
                streams.push({ server: "NM-Direct", link: url, type: /\.m3u8/i.test(url) ? "m3u8" : "mp4", headers: { "User-Agent": UA, Referer: REFERER } });
            }
        }
        catch (_b) { }
        return streams;
    });
};
exports.getStream = getStream;
