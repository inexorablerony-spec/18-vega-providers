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
        const empty = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
        try {
            const { axios, cheerio } = providerContext;
            const res = yield axios.get(link, { headers: { "User-Agent": "Mozilla/5.0", "Referer": "https://www.erome.com/" }, timeout: 20000 });
            const html = String(res.data || "");
            const $ = cheerio.load(html);
            const title = $("h1").first().text().trim() || $('meta[property="og:title"]').attr("content") || "Erome Album";
            const image = $('meta[property="og:image"]').attr("content") || "";
            const links = [];
            const seen = new Set();
            // Extract video sources
            $("video, video source, .video-source").each((_, el) => {
                const node = $(el);
                const candidates = [node.attr("src"), node.attr("data-src"), node.attr("data-video")];
                for (const candidate of candidates) {
                    if (!candidate)
                        continue;
                    let url = candidate.replace(/&amp;/g, "&").trim();
                    if (url.startsWith("//"))
                        url = "https:" + url;
                    if (url.startsWith("/"))
                        url = "https://www.erome.com" + url;
                    if (!/^https?:\/\//i.test(url) || !/\.mp4(?:$|[?#])/i.test(url) || seen.has(url))
                        continue;
                    seen.add(url);
                    links.push({ title: `Play ${links.length + 1}`, quality: "auto", directLinks: [{ title: "MP4", link: url, type: "movie" }] });
                }
            });
            // Also look for MP4 URLs in page
            const mp4s = html.match(/https?:\/\/[^"'\s]+\.mp4[^"'\s]*/gi) || [];
            for (const u of mp4s) {
                if (seen.has(u) || /thumb|preview/i.test(u))
                    continue;
                seen.add(u);
                links.push({ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: u, type: "movie" }] });
            }
            return { title, synopsis: "", image, imdbId: "", type: "movie", linkList: links };
        }
        catch (_b) {
            return empty;
        }
    });
};
exports.getMeta = getMeta;
