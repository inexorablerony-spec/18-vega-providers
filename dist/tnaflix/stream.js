// @vega-provider tnaflix
// @vega-version 1.0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = void 0;
const getStream = async function ({ link }) {
  if (!link) return [];
  return [{ server: "tnaflix", link: link, type: "mp4", headers: { Referer: "https://www.tnaflix.com/", "User-Agent": "Mozilla/5.0" } }];
};
exports.getStream = getStream;
