// @vega-provider eporner
// @vega-version 1.7
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeta = void 0;
const getMeta = async function ({ link, providerContext }) {
  const empty = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://www.eporner.com/" }, timeout: 20000 });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $("h1").first().text().trim() || "Untitled";
    const image = $('meta[property="og:image"]').attr("content") || "";
    const links = [];
    const seen = new Set();
    // Extract dload URLs and follow redirects to get CDN URLs
    const dloads = html.match(/\/dload\/[^"'\s]+\.mp4/gi) || [];
    for (const u of dloads.slice(0, 3)) {
      const dloadUrl = "https://www.eporner.com" + u;
      if (seen.has(dloadUrl)) continue;
      seen.add(dloadUrl);
      try {
        // Follow redirect to get CDN URL
        const dloadRes = await axios.get(dloadUrl, { 
          headers: { "User-Agent": "Mozilla/5.0", Referer: "https://www.eporner.com/" }, 
          maxRedirects: 5, 
          timeout: 15000 
        });
        const cdnUrl = dloadRes.request?.res?.responseUrl || dloadRes.request?.responseURL || dloadRes.config?.url;
        if (cdnUrl && cdnUrl.includes(".mp4") && cdnUrl !== dloadUrl) {
          const quality = u.includes("/1080/") ? "1080p" : u.includes("/720/") ? "720p" : u.includes("/480/") ? "480p" : "360p";
          links.push({ title: "Play (" + quality + ")", quality: quality, directLinks: [{ title: "CDN", link: cdnUrl, type: "movie" }] });
        } else {
          // Fallback to dload URL
          const quality = u.includes("/1080/") ? "1080p" : u.includes("/720/") ? "720p" : u.includes("/480/") ? "480p" : "360p";
          links.push({ title: "Play (" + quality + ")", quality: quality, directLinks: [{ title: "MP4", link: dloadUrl, type: "movie" }] });
        }
      } catch {
        // Fallback to dload URL
        const quality = u.includes("/1080/") ? "1080p" : u.includes("/720/") ? "720p" : u.includes("/480/") ? "480p" : "360p";
        links.push({ title: "Play (" + quality + ")", quality: quality, directLinks: [{ title: "MP4", link: dloadUrl, type: "movie" }] });
      }
    }
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList: links };
  } catch { return empty; }
};
exports.getMeta = getMeta;
