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
const TRACKERS = "&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://tracker.openbittorrent.com:6969/announce&tr=udp://open.stealth.si:80/announce";
const getStream = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ link, providerContext }) {
        if (!link)
            return [];
        const streams = [];
        try {
            const axios = providerContext === null || providerContext === void 0 ? void 0 : providerContext.axios;
            if (!axios)
                return [];
            const res = yield axios.get(link, { headers: { "User-Agent": UA, Referer: "https://sxyprn.com/" }, timeout: 20000 });
            const html = res.data || "";
            const torrentMatch = html.match(/myporn\.club\/t\/([a-zA-Z0-9]+)/);
            if (torrentMatch) {
                const tRes = yield axios.get(`https://myporn.club/t/${torrentMatch[1]}`, { headers: { "User-Agent": UA }, timeout: 15000 });
                const magnetMatch = (tRes.data || "").match(/magnet:\?xt=urn:btih:[a-f0-9]+/);
                if (magnetMatch)
                    streams.push({ server: "T2 Trackers", link: magnetMatch[0] + TRACKERS, type: "torrent" });
            }
        }
        catch (_b) { }
        return streams;
    });
};
exports.getStream = getStream;
