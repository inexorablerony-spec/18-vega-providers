// @vega-provider spankbang
// @vega-version 1.0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = void 0;
const getStream = async function ({ link }) {
  if (!link) return [];
  const url = link.replace(/&amp;/g, "&");
  return [{ server: "spankbang", link: url, type: url.includes(".m3u8") ? "hls" : "mp4", headers: { Referer: "https://spankbang.com/", "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" } }];
};
exports.getStream = getStream;
