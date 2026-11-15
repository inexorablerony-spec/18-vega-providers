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
const H = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36", Accept: "text/html", Referer: "https://www.perfectgirls.net/" };
const getMeta = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ link, providerContext }) {
        const empty = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
        try {
            const { axios, cheerio } = providerContext;
            const res = yield axios.get(link, { headers: H, timeout: 20000 });
            const html = String(res.data || "");
            const $ = cheerio.load(html);
            const title = $("h1").first().text().trim() || $("title").text().trim() || "Untitled";
            let image = $('meta[property="og:image"]').attr("content") || "";
            if (image.startsWith("//"))
                image = "https:" + image;
            const links = [];
            const seen = new Set();
            const re = /https?:\/\/[^"']+\/get_file\/[^"']+\.mp4[^"']*/gi;
            for (const m of html.matchAll(re)) {
                let u = m[0].replace(/&amp;/g, "&");
                if (seen.has(u.split("?")[0]))
                    continue;
                seen.add(u.split("?")[0]);
                const q = (u.match(/_(\d{3,4})p/i) || [])[1];
                links.push({ title: q ? "Play (" + q + "p)" : "Play", quality: q ? q + "p" : undefined, directLinks: [{ title: "MP4", link: u, type: "movie" }] });
            }
            const vu = (html.match(/video_url:\s*['"]([^'"]+)/) || [])[1];
            if (vu && !seen.has(vu.split("?")[0])) {
                links.push({ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: vu.replace(/&amp;/g, "&"), type: "movie" }] });
            }
            return { title, synopsis: "", image, imdbId: "", type: "movie", linkList: links };
        }
        catch (_b) {
            return empty;
        }
    });
};
exports.getMeta = getMeta;
