// @vega-provider eporner
// @vega-version 1.8
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = void 0;

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const getStream = async function ({ link }) {
  if (!link || !/^https?:\/\//i.test(link)) return [];

  let pathname = link;
  try {
    pathname = new URL(link).pathname;
  } catch {
    return [];
  }

  if (!/\.mp4$/i.test(pathname)) return [];

  const idMatch = link.match(/\/(?:dwnld|download)\/([a-z0-9]+)/i);
  const referer = idMatch ? `https://www.eporner.com/embed/${idMatch[1]}` : "https://www.eporner.com/";

  return [{
    server: "eporner",
    link,
    type: "mp4",
    headers: { Referer: referer, "User-Agent": UA, Accept: "*/*" },
  }];
};
exports.getStream = getStream;
