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
const REFERER = "https://xhamster.one/";
const getStream = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ link, providerContext }) {
        if (!link)
            return [];
        const streams = [];
        try {
            const axios = providerContext === null || providerContext === void 0 ? void 0 : providerContext.axios;
            if (!axios)
                return [];
            if (link.includes("xh.video")) {
                streams.push({ server: "XH Embed", link, type: "embed", headers: { "User-Agent": UA, Referer: REFERER } });
                return streams;
            }
            const res = yield axios.get(link, { headers: { "User-Agent": UA, Referer: REFERER }, timeout: 20000 });
            const html = res.data || "";
            const embedMatch = html.match(/xh\.video\/p\/([a-zA-Z0-9]+)/);
            if (embedMatch) {
                const embedUrl = `https://xh.video/p/${embedMatch[1]}`;
                streams.push({ server: "XH Embed", link: embedUrl, type: "embed", headers: { "User-Agent": UA, Referer: REFERER } });
            }
        }
        catch (_b) { }
        return streams;
    });
};
exports.getStream = getStream;
