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
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
const REFERER = "https://www.youporn.com/";
const getMeta = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ link, providerContext }) {
        var _b, _c, _d, _e;
        try {
            const { axios } = providerContext;
            const headers = { "User-Agent": UA, Referer: REFERER };
            const res = yield axios.get(link, { headers, timeout: 15000 });
            const html = res.data || "";
            const title = ((_c = (_b = html.match(/<title[^>]*>(.*?)<\/title>/i)) === null || _b === void 0 ? void 0 : _b[1]) === null || _c === void 0 ? void 0 : _c.replace(/\s*-\s*YouPorn.*$/i, "").trim()) || "YouPorn";
            const image = ((_d = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i)) === null || _d === void 0 ? void 0 : _d[1]) || "";
            const linkList = [];
            const directLinks = [];
            const mediaMatch = html.match(/mediaDefinitions"\s*:\s*(\[[^\]]+\])/);
            if (mediaMatch) {
                try {
                    const definitions = JSON.parse(mediaMatch[1].replace(/\\/g, ""));
                    for (const def of definitions) {
                        if (def.format === "hls" && def.videoUrl) {
                            const hlsRes = yield axios.get(def.videoUrl, { headers, timeout: 15000 });
                            const variants = Array.isArray(hlsRes.data) ? hlsRes.data : [];
                            for (const v of variants) {
                                if (v.videoUrl && v.quality) {
                                    directLinks.push({
                                        title: `${v.quality}p`,
                                        link: v.videoUrl,
                                        type: "m3u8"
                                    });
                                }
                            }
                        }
                    }
                }
                catch (_f) { }
            }
            if (directLinks.length > 0) {
                directLinks.sort((a, b) => parseInt(b.title) - parseInt(a.title));
                linkList.push({
                    title: "Play",
                    quality: ((_e = directLinks[0]) === null || _e === void 0 ? void 0 : _e.title) || "Auto",
                    directLinks
                });
            }
            return { title, synopsis: "", image, imdbId: "", type: "movie", linkList };
        }
        catch (_g) {
            return { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
        }
    });
};
exports.getMeta = getMeta;
