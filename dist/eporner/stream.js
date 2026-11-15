// @vega-provider eporner
// @vega-version 2.0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = void 0;
const getStream = async function ({ link }) {
  if (!link) return [];
  return [{ server: "eporner", link: link, type: "mp4", headers: { Referer: "https://www.eporner.com/", "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" } }];
};
exports.getStream = getStream;
