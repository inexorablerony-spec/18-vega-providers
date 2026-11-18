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
const getMeta = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ link, providerContext }) {
        var _b, _c, _d;
        try {
            const { axios } = providerContext;
            const res = yield axios.get(link, {
                headers: { "User-Agent": UA },
                timeout: 15000
            });
            const html = res.data || "";
            const title = ((_c = (_b = html.match(/<title[^>]*>(.*?)<\/title>/i)) === null || _b === void 0 ? void 0 : _b[1]) === null || _c === void 0 ? void 0 : _c.replace(/\s*-\s*YouPorn.*$/i, "").trim()) || "YouPorn";
            const image = ((_d = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i)) === null || _d === void 0 ? void 0 : _d[1]) || "";
            const linkList = [];
            const mediaMatch = html.match(/mediaDefinitions"\s*:\s*(\[[^\]]+\])/);
            if (mediaMatch) {
                try {
                    const definitions = JSON.parse(mediaMatch[1].replace(/\\/g, ""));
                    const directLinks = [];
                    for (const def of definitions) {
                        if (def.videoUrl) {
                            const type = def.format === "hls" ? "m3u8" : "mp4";
                            const label = def.format === "hls" ? "HLS" : "MP4";
                            directLinks.push({
                                title: label,
                                link: def.videoUrl,
                                type
                            });
                        }
                    }
                    if (directLinks.length > 0) {
                        linkList.push({
                            title: "Play",
                            quality: "Auto",
                            directLinks
                        });
                    }
                }
                catch (_e) { }
            }
            return { title, synopsis: "", image, imdbId: "", type: "movie", linkList };
        }
        catch (_f) {
            return { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
        }
    });
};
exports.getMeta = getMeta;
