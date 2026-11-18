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
        var _b, _c, _d, _e, _f, _g;
        try {
            const { axios } = providerContext;
            const res = yield axios.get(link, { headers: { "User-Agent": UA }, timeout: 15000 });
            const html = res.data || "";
            const title = ((_c = (_b = html.match(/<title[^>]*>(.*?)<\/title>/i)) === null || _b === void 0 ? void 0 : _b[1]) === null || _c === void 0 ? void 0 : _c.replace(/\s*-\s*Porn4Fans.*$/i, "").trim()) || "Porn4Fans";
            const image = ((_d = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i)) === null || _d === void 0 ? void 0 : _d[1]) || "";
            const linkList = [];
            const directLinks = [];
            const seen = new Set();
            // Extract MP4 URLs with quality from filename
            const mp4Match = html.match(/https?:\/\/[^"'\s]+get_file[^"'\s]+\.mp4[^"'\s]*/gi) || [];
            for (const url of mp4Match) {
                if (url.includes("preview"))
                    continue;
                // Extract quality from URL (e.g., _720p.mp4, _1080p.mp4)
                const qualityMatch = url.match(/_(\d+p)\.mp4/i);
                const quality = qualityMatch ? qualityMatch[1] : "480p";
                // Deduplicate by quality
                if (seen.has(quality))
                    continue;
                seen.add(quality);
                directLinks.push({
                    title: quality,
                    link: url,
                    type: "mp4"
                });
            }
            // Also check video_url_text for default quality
            const defaultQuality = (_e = html.match(/video_url_text:\s*'(\d+p)'/)) === null || _e === void 0 ? void 0 : _e[1];
            const defaultUrl = (_f = html.match(/video_url:\s*'(https?:\/\/[^']+)'/)) === null || _f === void 0 ? void 0 : _f[1];
            if (defaultUrl && defaultQuality && !seen.has(defaultQuality) && !defaultUrl.includes("preview")) {
                directLinks.push({
                    title: defaultQuality,
                    link: defaultUrl,
                    type: "mp4"
                });
            }
            if (directLinks.length > 0) {
                // Sort by quality descending
                directLinks.sort((a, b) => parseInt(b.title) - parseInt(a.title));
                linkList.push({
                    title: "Play",
                    quality: ((_g = directLinks[0]) === null || _g === void 0 ? void 0 : _g.title) || "HD",
                    directLinks
                });
            }
            return { title, synopsis: "", image, imdbId: "", type: "movie", linkList };
        }
        catch (_h) {
            return { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
        }
    });
};
exports.getMeta = getMeta;
