// @vega-provider eporner
// @vega-version 1.5
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
      // First request without following redirects to get Location
      const res = await axios.get(link, { 
        headers: { "User-Agent": "Mozilla/5.0", Referer: "https://www.eporner.com/" }, 
        maxRedirects: 0,
        timeout: 10000,
        validateStatus: (s) => s >= 200 && s < 400
      });
      const location = res.headers && (res.headers.location || res.headers.Location);
      if (location && location.includes(".mp4")) {
        const cdnUrl = location.startsWith("http") ? location : "https://www.eporner.com" + location;
        return [{ server: "eporner", link: cdnUrl, type: "mp4", headers: { Referer: "https://www.eporner.com/", "User-Agent": "Mozilla/5.0" } }];
      }
    } catch (e) {
      // If maxRedirects:0 fails, try with redirects
      try {
        const { axios } = providerContext;
        const res2 = await axios.get(link, { 
          headers: { "User-Agent": "Mozilla/5.0", Referer: "https://www.eporner.com/" }, 
          maxRedirects: 5,
          timeout: 15000
        });
        const finalUrl = res2.request?.res?.responseUrl || res2.config?.url;
        if (finalUrl && finalUrl.includes(".mp4") && finalUrl !== link) {
          return [{ server: "eporner", link: finalUrl, type: "mp4", headers: { Referer: "https://www.eporner.com/", "User-Agent": "Mozilla/5.0" } }];
        }
      } catch {}
    }
  }
  return [{ server: "eporner", link: link, type: "mp4", headers: { Referer: "https://www.eporner.com/", "User-Agent": "Mozilla/5.0" } }];
};
exports.getStream = getStream;
