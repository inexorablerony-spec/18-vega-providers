"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = void 0;
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const getStream = async function ({ link }) {
  try {
    if (!link) return [];
    const url = new URL(link);
    const isHls = /\.m3u8(?:$|[?#])/i.test(url.href);
    const isMp4 = /\.mp4(?:$|[?#])/i.test(url.href);
    if (!isHls && !isMp4) return [];
    return [{ server: "xhamster", link: url.href, type: isHls ? "hls" : "mp4", headers: { "User-Agent": UA, Referer: "https://xhamster.com/", Accept: "*/*" } }];
  } catch { return []; }
};
exports.getStream = getStream;
