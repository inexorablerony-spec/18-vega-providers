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
        var _b;
        const empty = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
        try {
            const { axios, cheerio } = providerContext;
            const res = yield axios.get(link, { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://www.pornhat.com/" }, timeout: 20000 });
            const html = String(res.data || "");
            const $ = cheerio.load(html);
            const title = $("h1").first().text().trim() || $("title").text().trim() || "Untitled";
            const image = $('meta[property="og:image"]').attr("content") || "";
            const directLinks = [];
            const seen = new Set();
            const mp4s = html.match(/https?:\/\/[^"'\s]*get_file[^"'\s]*\.mp4[^"'\s]*/gi) || [];
            for (const u of mp4s) {
                const clean = u.replace(/&amp;/g, "&");
                if (clean.includes("preview") || clean.includes("trailer"))
                    continue;
                const qMatch = clean.match(/_(\d+p)\.mp4/i);
                const quality = qMatch ? qMatch[1] : "HD";
                if (seen.has(quality))
                    continue;
                seen.add(quality);
                directLinks.push({ title: quality, link: clean, type: "mp4" });
            }
            directLinks.sort((a, b) => parseInt(b.title) - parseInt(a.title));
            const linkList = [];
            if (directLinks.length > 0) {
                linkList.push({ title: "Play", quality: ((_b = directLinks[0]) === null || _b === void 0 ? void 0 : _b.title) || "HD", directLinks });
            }
            return { title, synopsis: "", image, imdbId: "", type: "movie", linkList };
        }
        catch (_c) {
            return empty;
        }
    });
};
exports.getMeta = getMeta;
