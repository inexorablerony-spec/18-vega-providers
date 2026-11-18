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
        if (!link)
            return [];
        const clean = link.replace(/&amp;/g, "&");
        // Skip trailers
        if (clean.includes("trailer") || clean.includes("preview"))
            return [];
        const qMatch = clean.match(/_(\d+p)\.mp4/i);
        const quality = qMatch ? qMatch[1] : "720p";
        return [{
                server: `HellPorno ${quality}`,
                link: clean,
                type: "mp4",
                headers: { Referer: "https://hellporno.com/", "User-Agent": "Mozilla/5.0" }
            }];
    });
};
exports.getStream = getStream;
