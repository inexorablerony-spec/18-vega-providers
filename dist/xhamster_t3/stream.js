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
const REFERER = "https://xhamster.com/";
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
            const matches = html.match(/https?:[^"'\s]+\.mp4[^"'\s]*/gi) || [];
            for (const url of matches) {
                if (url.includes("thumb"))
                    continue;
                let q = "auto";
                if (url.includes("1080"))
                    q = "1080p";
                else if (url.includes("720"))
                    q = "720p";
                else if (url.includes("480"))
                    q = "480p";
                streams.push({ server: `T3 ${q}`, link: url, type: "mp4", headers: { "User-Agent": UA, Referer: REFERER } });
            }
        }
        catch (_b) { }
        return streams;
    });
};
exports.getStream = getStream;
