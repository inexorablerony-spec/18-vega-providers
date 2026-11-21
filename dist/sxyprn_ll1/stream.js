"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = void 0;
const getStream = async function ({ link }) {
    if (!link) return [];
    return [{ server: "SxyPrn", link, type: "mp4", headers: { Referer: "https://sxyprn.com/", "User-Agent": "Mozilla/5.0" } }];
};
exports.getStream = getStream;
