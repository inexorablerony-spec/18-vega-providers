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
exports.getStream = void 0;
const UA = "Mozilla/5.0";
const REFERER = "https://sxyprn.com/";
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
const getStream = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ link, providerContext }) {
        if (!link)
            return [];
        const streams = [];
        try {
            const axios = providerContext === null || providerContext === void 0 ? void 0 : providerContext.axios;
            if (!axios)
                return [];
            const res = yield axios.get(link, { headers: { "User-Agent": UA, Referer: REFERER }, timeout: 20000 });
            const html = res.data || "";
            const vnfoMatch = html.match(/data-vnfo=['"]([^'"]+)['"]/);
            if (vnfoMatch) {
                try {
                    const data = JSON.parse(vnfoMatch[1].replace(/&quot;/g, '"'));
                    for (const path of Object.values(data)) {
                        if (typeof path !== "string")
                            continue;
                        const transformed = transformVid(path);
                        let url = transformed.startsWith("/") ? BASE + transformed : transformed;
                        streams.push({ server: "LL1a", link: url, type: "mp4", headers: { "User-Agent": UA, Referer: REFERER } });
                    }
                }
                catch (_b) { }
            }
        }
        catch (_c) { }
        return streams;
    });
};
exports.getStream = getStream;
