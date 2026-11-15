// @vega-provider sxyprn3
// @vega-version 1.0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = void 0;
const getStream = async function ({ link }) {
  if (!link || !/^https?:\/\//i.test(link)) return [];
  if (!/\.mp4/i.test(link)) return [];
  return [{ server: "sxyprn3", link, type: "mp4", headers: { Referer: "https://sxyprn.com/", "User-Agent": "Mozilla/5.0" } }];
};
exports.getStream = getStream;
