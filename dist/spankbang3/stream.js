// @vega-provider spankbang3
// @vega-version 1.0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = void 0;
const getStream = async function ({ link }) {
  if (!link || !link.includes(".mp4")) return [];
  return [{ server: "spankbang3", link, type: "mp4", headers: { Referer: "https://spankbang.com/", "User-Agent": "Mozilla/5.0" } }];
};
exports.getStream = getStream;
