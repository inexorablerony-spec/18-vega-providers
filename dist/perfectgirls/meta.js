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
        var _b, _c, _d;
        const empty = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
        try {
            const { axios, cheerio } = providerContext;
            const res = yield axios.get(link, { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://www.perfectgirls.net/" }, timeout: 20000 });
            const html = String(res.data || "");
            const $ = cheerio.load(html);
            const title = $("h1").first().text().trim() || $("title").text().trim() || "Untitled";
            const image = $('meta[property="og:image"]').attr("content") || "";
            const directLinks = [];
            const seen = new Set();
            const videoUrl = (_b = html.match(/video_url:\s*'([^']+)'/)) === null || _b === void 0 ? void 0 : _b[1];
            const videoQuality = ((_c = html.match(/video_url_text:\s*'([^']+)'/)) === null || _c === void 0 ? void 0 : _c[1]) || "HD";
            if (videoUrl && !videoUrl.includes("preview")) {
                seen.add(videoQuality);
                directLinks.push({ title: videoQuality, link: videoUrl.replace(/&amp;/g, "&"), type: "mp4" });
            }
            if (directLinks.length === 0) {
                const mp4s = html.match(/https?:\/\/[^"'\s]+\.mp4[^"'\s]*/gi) || [];
                for (const u of mp4s.slice(0, 3)) {
                    const clean = u.replace(/&amp;/g, "&");
                    if (clean.includes("preview") || clean.includes("thumb") || seen.has(clean))
                        continue;
                    seen.add(clean);
                    const qMatch = clean.match(/_(\d+p)\.mp4/i);
                    directLinks.push({ title: qMatch ? qMatch[1] : "HD", link: clean, type: "mp4" });
                }
            }
            const linkList = [];
            if (directLinks.length > 0) {
                linkList.push({ title: "Play", quality: ((_d = directLinks[0]) === null || _d === void 0 ? void 0 : _d.title) || "HD", directLinks });
            }
            return { title, synopsis: "", image, imdbId: "", type: "movie", linkList };
        }
        catch (_e) {
            return empty;
        }
    });
};
exports.getMeta = getMeta;
