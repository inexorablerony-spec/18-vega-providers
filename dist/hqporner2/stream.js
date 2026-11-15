// @vega-provider hqporner2
// @vega-version 1.0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = void 0;
const getStream = async function ({ link }) {
  if (!link || !link.includes(".mp4")) return [];
  return [{ server: "hqporner2", link: link, type: "mp4", headers: { Referer: "https://mydaddy.cc/", "User-Agent": "Mozilla/5.0" } }];
};
exports.getStream = getStream;
