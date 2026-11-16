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
exports.getStream = getStream;
function getStream(_a) {
    return __awaiter(this, arguments, void 0, function* ({ link }) {
        if (!link)
            return [];
        const lower = link.toLowerCase();
        const type = lower.includes(".m3u8") ? "m3u8" : "mp4";
        return [{
                server: "wowxxx",
                link,
                type,
                headers: { "User-Agent": "Mozilla/5.0", Referer: "https://www.wowxxx.to/" },
            }];
    });
}
