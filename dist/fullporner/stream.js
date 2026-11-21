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
const QUALITY = { 1: "360", 2: "480", 4: "720", 8: "1080" };
function resolve(link, axios) {
    return __awaiter(this, void 0, void 0, function* () {
        if (link.indexOf("xiaoshenke.net") >= 0 && link.indexOf("/s0/") < 0) {
            try {
                const res = yield axios.get(link, {
                    headers: { "User-Agent": "Mozilla/5.0", Referer: "https://fullporner.com/" },
                    maxRedirects: 0,
                    validateStatus: function (s) { return s < 400; },
                    timeout: 10000,
                });
                const loc = (res.headers && res.headers.location) || "";
                if (loc.indexOf("//") === 0) return "https:" + loc;
                if (loc.indexOf("/") === 0) return "https://xiaoshenke.net" + loc;
                if (loc) return loc;
            } catch (e) {}
        }
        if (link.indexOf("/watch/") >= 0) {
            try {
                const res = yield axios.get(link, { headers: { "User-Agent": "Mozilla/5.0" }, timeout: 15000 });
                const html = String(res.data || "");
                const iframeMatch = html.match(/iframe[^>]+src=["']([^"']+)["']/i);
                const iframe = iframeMatch ? iframeMatch[1] : "";
                const m = iframe.match(/\/(?:video|player)\/([a-z0-9]+)\/(\d+)/i);
                if (m) {
                    const mediaId = m[1].split("").reverse().join("");
                    const mask = parseInt(m[2], 10);
                    const bits = [8, 4, 2, 1];
                    for (let i = 0; i < bits.length; i++) {
                        if (mask & bits[i]) {
                            const raw = "https://xiaoshenke.net/vid/" + mediaId + "/" + QUALITY[bits[i]];
                            return yield resolve(raw, axios);
                        }
                    }
                }
            } catch (e) {}
        }
        return link;
    });
}
const getStream = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ link, providerContext }) {
        if (!link) return [];
        const axios = providerContext && providerContext.axios;
        const final = axios ? yield resolve(link, axios) : link;
        return [{ server: "FullPorner", link: final, type: "mp4", headers: { Referer: "https://fullporner.com/", "User-Agent": "Mozilla/5.0" } }];
    });
};
exports.getStream = getStream;
