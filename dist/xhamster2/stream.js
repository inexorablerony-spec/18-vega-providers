// @vega-provider xhamster2
// @vega-version 1.2
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = void 0;
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";
const getStream = async function ({ link }) {
  try {
    const url = new URL(link);
    if (!/\.xhcdn\.com$/i.test(url.hostname)) return [];
    const hls = /\.m3u8(?:$|[?#])/i.test(url.href);
    const mp4 = /\.mp4(?:$|[?#])/i.test(url.href);
    if (!hls && !mp4) return [];
    return [{ server: "xhamster2", link: url.href, type: hls ? "hls" : "mp4", headers: { "User-Agent": UA, "Referer": "https://xhamster2.com/", "Accept": "*/*" } }];
  } catch { return []; }
};
exports.getStream = getStream;
