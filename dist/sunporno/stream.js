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
const getStream = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ link }) {
        try {
            if (!link)
                return [];
            const url = link.replace(/&amp;/g, "&");
            const m = url.match(/_(\d{3,4})p/i);
            let quality;
            if (m) {
                const n = m[1];
                quality = n === "2160" ? "2160" : n === "1080" ? "1080" : n === "720" ? "720" : n === "480" ? "480" : "360";
            }
            return [{ server: "sunporno", link: url, type: "mp4", quality, headers: { Referer: "https://www.sunporno.com/", "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36" } }];
        }
        catch (_b) {
            return [];
        }
    });
};
exports.getStream = getStream;
