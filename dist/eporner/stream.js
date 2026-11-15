// @vega-provider eporner
// @vega-version 1.2
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = void 0;
const getStream = async function ({ link }) {
  if (!link) return [];
  if (!link.includes(".mp4")) return [];
  return [{ server: "eporner", link: link, type: "mp4", headers: { Referer: "https://www.eporner.com/", "User-Agent": "Mozilla/5.0" } }];
};
exports.getStream = getStream;
