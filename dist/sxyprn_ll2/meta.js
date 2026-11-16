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
const BASE = "https://sxyprn.com";
function ssut51(arg) {
    const str = arg.replace(/[^0-9]/g, "");
    let sut = 0;
    for (let i = 0; i < str.length; i++)
        sut += parseInt(str.charAt(i), 10);
    return sut;
}
function btoaPure(str) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let result = "";
    let i = 0;
    while (i < str.length) {
        const a = str.charCodeAt(i++);
        const b = i < str.length ? str.charCodeAt(i++) : 0;
        const c = i < str.length ? str.charCodeAt(i++) : 0;
        const triplet = (a << 16) | (b << 8) | c;
        result += chars[(triplet >> 18) & 63] + chars[(triplet >> 12) & 63];
        result += i > str.length + 1 ? "=" : chars[(triplet >> 6) & 63];
        result += i > str.length ? "=" : chars[triplet & 63];
    }
    return result;
}
function boo(ss, es) {
    return btoaPure(ss + "-sxyprn.com-" + es).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, ".");
}
function transformVid(path) {
    const tmp = path.split("/");
    if (tmp.length < 8)
        return path;
    tmp[1] += "8/" + boo(ssut51(tmp[6]), ssut51(tmp[7]));
    tmp[5] = String(parseInt(tmp[5]) - ssut51(tmp[6]) - ssut51(tmp[7]));
    return tmp.join("/");
}
const getMeta = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ link, providerContext }) {
        var _b, _c;
        try {
            const { axios } = providerContext;
            const res = yield axios.get(link, { headers: { "User-Agent": UA }, timeout: 15000 });
            const html = res.data || "";
            const title = ((_b = html.match(/<title[^>]*>(.*?)<\/title>/i)) === null || _b === void 0 ? void 0 : _b[1]) || "SxyPrn";
            const image = ((_c = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i)) === null || _c === void 0 ? void 0 : _c[1]) || "";
            const linkList = [];
            const vnfoMatch = html.match(/data-vnfo=['"]([^'"]+)['"]/);
            if (vnfoMatch) {
                try {
                    const data = JSON.parse(vnfoMatch[1].replace(/&quot;/g, '"'));
                    for (const path of Object.values(data)) {
                        if (typeof path !== "string")
                            continue;
                        const transformed = transformVid(path);
                        let url = transformed.startsWith("/") ? BASE + transformed : transformed;
                        linkList.push({ title: "Play", quality: "HD", directLinks: [{ title: "Play", link: url, type: "mp4" }] });
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
