// @vega-provider xvideos
// @vega-version 1.1
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = void 0;
const getStream = async function ({ link }) {
  if (!link) return [];
  return [{ 
    server: "xvideos", 
    link: link, 
    type: link.includes(".m3u8") ? "hls" : "mp4", 
    headers: { Referer: "https://www.xvideos.com/", "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" } 
  }];
};
exports.getStream = getStream;
