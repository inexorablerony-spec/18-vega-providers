// @vega-provider wankoz
// @vega-version 1.1
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = void 0;
const getStream = async function ({ link }) {
  if (!link) return [];
  return [{ server: "wankoz", link: link.replace(/&amp;/g, "&"), type: "mp4", headers: { Referer: "https://www.wankoz.com/", "User-Agent": "Mozilla/5.0" } }];
};
exports.getStream = getStream;
