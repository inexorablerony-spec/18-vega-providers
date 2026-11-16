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
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const getStream = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ link, }) {
        if (!link || !/^https?:\/\//i.test(link)) {
            return [];
        }
        let pathname = link;
        try {
            pathname = new URL(link).pathname;
        }
        catch (_b) {
            return [];
        }
        if (!/\.mp4$/i.test(pathname)) {
            return [];
        }
        const idMatch = link.match(/\/(?:dwnld|download)\/([a-z0-9]+)/i);
        const referer = idMatch ? `https://www.eporner.com/embed/${idMatch[1]}` : "https://www.eporner.com/";
        return [{
                server: "eporner",
                link,
                type: "mp4",
                headers: {
                    Referer: referer,
                    "User-Agent": UA,
                    Accept: "*/*",
                },
            }];
    });
};
exports.getStream = getStream;
