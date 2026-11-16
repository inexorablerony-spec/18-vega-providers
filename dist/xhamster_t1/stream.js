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
const REFERER = "https://xhamster.com/";
const getStream = function (_a) {
    return __awaiter(this, arguments, void 0, function* ({ link }) {
        if (!link)
            return [];
        if (/\.(mp4|m3u8)(\?|$)/i.test(link)) {
            return [{ server: "T1 Direct", link, type: /\.m3u8/i.test(link) ? "m3u8" : "mp4", headers: { "User-Agent": UA, Referer: REFERER } }];
        }
        return [];
    });
};
exports.getStream = getStream;
