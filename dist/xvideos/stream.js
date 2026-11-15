// @vega-provider xvideos
// @vega-version 1.0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = void 0;
const getStream = async function ({ link }) {
  if (!link) return [];
  return [{ server: "xvideos", link: link, type: link.includes(".m3u8") ? "hls" : "mp4", headers: { Referer: "https://www.xvideos.com/", "User-Agent": "Mozilla/5.0" } }];
};
exports.getStream = getStream;
