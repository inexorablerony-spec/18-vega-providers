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
function expandHls(url, axios) {
    return __awaiter(this, void 0, void 0, function* () {
        const out = [];
        const headers = { "User-Agent": UA, Referer: REFERER };
        try {
            const res = yield axios.get(url, { headers, timeout: 15000 });
            const text = res.data || "";
            if (!text.includes("#EXT-X-STREAM-INF")) {
                out.push({ server: "T2 HLS", link: url, type: "m3u8", headers });
                return out;
            }
            const lines = text.split(/\r?\n/);
            for (let i = 0; i < lines.length; i++) {
                if (!lines[i].startsWith("#EXT-X-STREAM-INF"))
                    continue;
                const m = lines[i].match(/RESOLUTION=(\d+)x(\d+)/i);
                const next = (lines[i + 1] || "").trim();
                if (!next || next.startsWith("#"))
                    continue;
                const variant = next.startsWith("http") ? next : new URL(next, url).toString();
                const q = m ? m[2] + "p" : "auto";
                out.push({ server: `T2 ${q}`, link: variant, type: "m3u8", headers });
            }
        }
        catch (_a) { }
        if (out.length === 0)
            out.push({ server: "T2 HLS", link: url, type: "m3u8", headers });
        return out;
    });
}
const getStream = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ link, providerContext }) {
        if (!link || !/\.m3u8/i.test(link))
            return [];
        const axios = providerContext === null || providerContext === void 0 ? void 0 : providerContext.axios;
        if (!axios)
            return [];
        return yield expandHls(link, axios);
    });
};
exports.getStream = getStream;
