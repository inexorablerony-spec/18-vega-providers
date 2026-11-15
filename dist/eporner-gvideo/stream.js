// @vega-provider eporner-gvideo
// @vega-version 1.0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = void 0;
const getStream = async function ({ link }) {
  if (!link || !link.includes(".mp4")) return [];
  return [{ server: "eporner-gvideo", link: link, type: "mp4", headers: { Referer: "https://www.eporner.com/" } }];
};
exports.getStream = getStream;
