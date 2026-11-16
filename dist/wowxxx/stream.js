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
const getStream = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ link, providerContext }) {
        if (!link)
            return [];
        try {
            const axios = providerContext === null || providerContext === void 0 ? void 0 : providerContext.axios;
            if (!axios)
                return [{ server: "WowXXX", link, type: "mp4", headers: { "User-Agent": "Mozilla/5.0", Referer: "https://www.wowxxx.to/" } }];
            const res = yield axios.get(link, { headers: { "User-Agent": "Mozilla/5.0" }, timeout: 15000 });
            const html = res.data || "";
            const matches = html.match(/https?:\\?\/\\?\/[^"'\\\s]+?\.(?:mp4|m3u8)(?:\?[^"'\\\s]*)?/gi) || [];
            const unique = [...new Set(matches.map((l) => l.replace(/\\\//g, "/")))];
            if (unique.length) {
                return unique.map((l) => ({
                    server: "WowXXX",
                    link: l,
                    type: l.includes(".m3u8") ? "m3u8" : "mp4",
                    headers: { "User-Agent": "Mozilla/5.0", Referer: "https://www.wowxxx.to/" },
                }));
            }
        }
        catch (_b) { }
        return [{ server: "WowXXX", link, type: "mp4", headers: { "User-Agent": "Mozilla/5.0", Referer: "https://www.wowxxx.to/" } }];
    });
};
exports.getStream = getStream;
