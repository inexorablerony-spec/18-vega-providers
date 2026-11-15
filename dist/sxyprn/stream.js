// @vega-provider sxyprn
// @vega-version 1.0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = void 0;
const getStream = async function ({ link }) {
  if (!link || !link.includes(".mp4")) return [];
  return [{ server: "sxyprn", link, type: "mp4", headers: { Referer: "https://sxyprn.com/", "User-Agent": "Mozilla/5.0" } }];
};
exports.getStream = getStream;
