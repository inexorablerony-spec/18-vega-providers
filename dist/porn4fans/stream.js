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
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
const REFERER = "https://www.porn4fans.com/";
const getStream = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ link }) {
        if (!link || !/^https?:\/\//i.test(link))
            return [];
        if (!/\.mp4/i.test(link))
            return [];
        if (link.includes("preview"))
            return [];
        // Extract quality from URL
        const qualityMatch = link.match(/_(\d+p)\.mp4/i);
        const quality = qualityMatch ? qualityMatch[1] : "HD";
        return [{
                server: `Porn4Fans ${quality}`,
                link,
                type: "mp4",
                headers: { "User-Agent": UA, Referer: REFERER, Accept: "*/*" },
            }];
    });
};
exports.getStream = getStream;
