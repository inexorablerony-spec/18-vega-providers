// @vega-provider sxyprn
// @vega-version 1.0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = void 0;
const getStream = async function ({ link }) {
  if (!link || !/^https?:\/\//i.test(link)) return [];
  if (!link.includes(".mp4")) return [];
  return [{ server: "sxyprn", link, type: "mp4", headers: { "User-Agent": "Mozilla/5.0", "Referer": "https://sxyprn.com/", "Accept": "*/*" } }];
};
exports.getStream = getStream;
