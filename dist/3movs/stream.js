// @vega-provider 3movs
// @vega-version 1.0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = void 0;
const getStream = async function ({ link }) {
  if (!link) return [];
  return [{ server: "3movs", link: link.replace(/&amp;/g, "&"), type: "mp4", headers: { Referer: "https://www.3movs.com/", "User-Agent": "Mozilla/5.0" } }];
};
exports.getStream = getStream;
