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
exports.getMeta = void 0;
const UA = "Mozilla/5.0";
const BASE = "https://xmoviesforyou.com";
const getMeta = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ link, providerContext }) {
        var _b, _c;
        try {
            const { axios } = providerContext;
            const res = yield axios.get(link, { headers: { "User-Agent": UA }, timeout: 15000 });
            const html = res.data || "";
            const title = ((_b = html.match(/<title[^>]*>(.*?)<\/title>/i)) === null || _b === void 0 ? void 0 : _b[1]) || "XMoviesForYou";
            const image = ((_c = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i)) === null || _c === void 0 ? void 0 : _c[1]) || "";
            const linkList = [];
            const videoIdMatch = html.match(/videoId\s*=\s*"?(\d+)"?/);
            if (videoIdMatch) {
                const videoId = videoIdMatch[1];
                try {
                    const streamRes = yield axios.get(`${BASE}/api/stream/${videoId}`, { headers: { "User-Agent": UA }, timeout: 10000 });
                    const streamData = streamRes.data;
                    if (streamData && streamData.url) {
                        linkList.push({ title: "Play", quality: "HD", directLinks: [{ title: "HLS", link: streamData.url, type: "m3u8" }] });
                    }
                }
                catch (_d) { }
            }
            return { title, synopsis: "", image, imdbId: "", type: "movie", linkList };
        }
        catch (_e) {
            return { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
        }
    });
};
exports.getMeta = getMeta;
