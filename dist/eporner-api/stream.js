// @vega-provider eporner-api
// @vega-version 1.0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = void 0;
const getStream = async function ({ link }) {
  if (!link) return [];
  return [{ server: "eporner-api", link: link, type: link.includes(".mp4") ? "mp4" : "embed", headers: { Referer: "https://www.eporner.com/" } }];
};
exports.getStream = getStream;
