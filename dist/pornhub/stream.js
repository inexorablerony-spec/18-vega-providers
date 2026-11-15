// @vega-provider pornhub
// @vega-version 1.1
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = void 0;
const getStream = async function ({ link }) {
  if (!link || !link.includes(".mp4")) return [];
  return [{ server: "pornhub", link: link, type: "mp4", headers: { Referer: "https://www.pornhub.com/", "User-Agent": "Mozilla/5.0" } }];
};
exports.getStream = getStream;
