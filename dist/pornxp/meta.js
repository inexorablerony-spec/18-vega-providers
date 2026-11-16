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
exports.getMeta = getMeta;
const UA = "Mozilla/5.0";
function getMeta(_a) {
    return __awaiter(this, arguments, void 0, function* ({ link, providerContext }) {
        try {
            const { axios, cheerio } = providerContext;
            const res = yield axios.get(link, { headers: { "User-Agent": UA }, timeout: 20000 });
            const $ = cheerio.load(res.data || "");
            const title = $("h1").first().text().trim() || $('meta[property="og:title"]').attr("content") || "Video";
            const image = $('meta[property="og:image"]').attr("content") || "";
            const synopsis = $('meta[property="og:description"]').attr("content") || "";
            return {
                title, synopsis, image, imdbId: "", type: "movie",
                linkList: [{ title: "Play", quality: "auto", directLinks: [{ title: "Play", link, type: "movie" }] }],
            };
        }
        catch (_b) {
            return { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
        }
    });
}
