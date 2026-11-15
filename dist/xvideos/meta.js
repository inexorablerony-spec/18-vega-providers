// @vega-provider xvideos
// @vega-version 1.1
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeta = void 0;
const getMeta = async function ({ link, providerContext }) {
  const empty = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, { 
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", Referer: "https://www.xvideos.com/" }, 
      timeout: 20000 
    });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $("h1").first().text().trim() || $("title").text().trim() || "Untitled";
    const image = $('meta[property="og:image"]').attr("content") || "";
    const links = [];
    const seen = new Set();
    // Extract from html5player.setVideoUrlHigh/Low
    const high = (html.match(/html5player\.setVideoUrlHigh\(['"]([^'"]+)/) || [])[1];
    const low = (html.match(/html5player\.setVideoUrlLow\(['"]([^'"]+)/) || [])[1];
    const hls = (html.match(/html5player\.setVideoHLS\(['"]([^'"]+)/) || [])[1];
    for (const [u, q] of [[high, "720p"], [low, "360p"], [hls, "HLS"]]) {
      if (u && !seen.has(u)) {
        seen.add(u);
        links.push({ title: "Play (" + q + ")", quality: q, directLinks: [{ title: "Video", link: u.replace(/&amp;/g, "&"), type: "movie" }] });
      }
    }
    // Fallback: mp4-cdn77
    const cdn = html.match(/https?:\/\/mp4-cdn77\.xvideos-cdn\.com\/[^"'\s]+\.mp4/gi) || [];
    for (const u of cdn) {
      if (seen.has(u)) continue;
      seen.add(u);
      links.push({ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: u, type: "movie" }] });
    }
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList: links };
  } catch { return empty; }
};
exports.getMeta = getMeta;
