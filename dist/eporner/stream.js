// @vega-provider eporner
// @vega-version 1.6
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStream = void 0;
const getStream = async function ({ link, providerContext }) {
  if (!link) return [];
  if (!link.includes(".mp4")) return [];
  // If it's a dload URL, follow redirect to get CDN URL
  if (link.includes("/dload/") && providerContext) {
    try {
      const { axios } = providerContext;
      // Follow redirects and get final URL
      const res = await axios.get(link, { 
        headers: { "User-Agent": "Mozilla/5.0", Referer: "https://www.eporner.com/" }, 
        maxRedirects: 5,
        timeout: 15000
      });
      // Try multiple ways to get the final URL
      const finalUrl = res.request?.res?.responseUrl || res.request?.responseURL || res.config?.url || link;
      if (finalUrl && finalUrl.includes(".mp4") && finalUrl !== link) {
        return [{ server: "eporner", link: finalUrl, type: "mp4", headers: { Referer: "https://www.eporner.com/", "User-Agent": "Mozilla/5.0" } }];
      }
    } catch (e) {}
  }
  return [{ server: "eporner", link: link, type: "mp4", headers: { Referer: "https://www.eporner.com/", "User-Agent": "Mozilla/5.0" } }];
};
exports.getStream = getStream;
