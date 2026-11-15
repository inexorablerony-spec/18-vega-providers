// @vega-provider xvideos
// @vega-version 1.2
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
    // Extract HLS (signed URL that works)
    const hls = (html.match(/html5player\.setVideoHLS\(['"]([^'"]+)/) || [])[1];
    if (hls && !seen.has(hls)) {
      seen.add(hls);
      links.push({ title: "Play (HLS)", quality: "auto", directLinks: [{ title: "HLS", link: hls.replace(/&amp;/g, "&"), type: "movie" }] });
    }
    // Extract HLS from hls-cdn77
    const hlsCdn = html.match(/https?:\/\/hls-cdn77\.xvideos-cdn\.com\/[^"'\s]+\.m3u8/gi) || [];
    for (const u of hlsCdn) {
      if (seen.has(u)) continue;
      seen.add(u);
      links.push({ title: "Play (HLS)", quality: "auto", directLinks: [{ title: "HLS", link: u, type: "movie" }] });
    }
    // Fallback MP4 (may be blocked)
    const mp4 = html.match(/https?:\/\/mp4-cdn77\.xvideos-cdn\.com\/[^"'\s]+\.mp4/gi) || [];
    for (const u of mp4.slice(0, 1)) {
      if (seen.has(u)) continue;
      seen.add(u);
      links.push({ title: "Play (MP4)", quality: "auto", directLinks: [{ title: "MP4", link: u, type: "movie" }] });
    }
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList: links };
  } catch { return empty; }
};
exports.getMeta = getMeta;
