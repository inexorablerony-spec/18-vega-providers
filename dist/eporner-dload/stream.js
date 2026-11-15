// @vega-provider eporner-dload
// @vega-version 1.0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = void 0;
const getStream = async function ({ link, providerContext }) {
  if (!link || !link.includes(".mp4")) return [];
  if (link.includes("/dload/") && providerContext) {
    try {
      const { axios } = providerContext;
      const res = await axios.get(link, { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://www.eporner.com/" }, maxRedirects: 0, timeout: 10000, validateStatus: (s) => s >= 200 && s < 400 });
      const location = res.headers && (res.headers.location || res.headers.Location);
      if (location && location.includes(".mp4")) {
        return [{ server: "eporner-dload", link: location.startsWith("http") ? location : "https://www.eporner.com" + location, type: "mp4", headers: { Referer: "https://www.eporner.com/" } }];
      }
    } catch {}
  }
  return [{ server: "eporner-dload", link: link, type: "mp4", headers: { Referer: "https://www.eporner.com/" } }];
};
exports.getStream = getStream;
