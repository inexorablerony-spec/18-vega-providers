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
const getMeta = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ link, providerContext }) {
        var _b, _c, _d, _e, _f;
        const empty = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
        try {
            const { axios, cheerio } = providerContext;
            const res = yield axios.get(link, {
                headers: { "User-Agent": "Mozilla/5.0", Referer: "https://www.wankoz.com/" },
                timeout: 20000
            });
            const html = String(res.data || "");
            const $ = cheerio.load(html);
            const title = $("h1").first().text().trim() || $("title").text().trim() || "Untitled";
            const image = $('meta[property="og:image"]').attr("content") || "";
            const directLinks = [];
            const seen = new Set();
            // Extract video_url with quality
            const videoUrl = (_b = html.match(/video_url:\s*'([^']+)'/)) === null || _b === void 0 ? void 0 : _b[1];
            const videoQuality = ((_c = html.match(/video_url_text:\s*'(\d+p)'/)) === null || _c === void 0 ? void 0 : _c[1]) || "720p";
            if (videoUrl && !videoUrl.includes("preview") && !seen.has(videoQuality)) {
                seen.add(videoQuality);
                directLinks.push({
                    title: videoQuality,
                    link: videoUrl.replace(/&amp;/g, "&"),
                    type: "mp4"
                });
            }
            // Extract video_alt_url with quality (usually higher)
            const altUrl = (_d = html.match(/video_alt_url:\s*'([^']+)'/)) === null || _d === void 0 ? void 0 : _d[1];
            const altQuality = ((_e = html.match(/video_alt_url_text:\s*'(\d+p)'/)) === null || _e === void 0 ? void 0 : _e[1]) || "1080p";
            if (altUrl && !altUrl.includes("preview") && !seen.has(altQuality)) {
                seen.add(altQuality);
                directLinks.push({
                    title: altQuality,
                    link: altUrl.replace(/&amp;/g, "&"),
                    type: "mp4"
                });
            }
            // Fallback: extract from get_file URLs
            if (directLinks.length === 0) {
                const gf = html.match(/https?:\/\/[^"'\s]*get_file[^"'\s]*\.mp4[^"'\s]*/gi) || [];
                for (const u of gf) {
                    const clean = u.replace(/&amp;/g, "&");
                    if (clean.includes("preview") || seen.has(clean))
                        continue;
                    seen.add(clean);
                    // Guess quality from suffix
                    let quality = "HD";
                    if (clean.includes("_a.mp4"))
                        quality = "1080p";
                    else if (clean.includes("_s.mp4"))
                        quality = "720p";
                    directLinks.push({ title: quality, link: clean, type: "mp4" });
                }
            }
            const linkList = [];
            if (directLinks.length > 0) {
                directLinks.sort((a, b) => parseInt(b.title) - parseInt(a.title));
                linkList.push({
                    title: "Play",
                    quality: ((_f = directLinks[0]) === null || _f === void 0 ? void 0 : _f.title) || "HD",
                    directLinks
                });
            }
            return { title, synopsis: "", image, imdbId: "", type: "movie", linkList };
        }
        catch (_g) {
            return empty;
        }
    });
};
exports.getMeta = getMeta;
