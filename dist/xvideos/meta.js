// @vega-provider xvideos
// @vega-version 1.0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeta = void 0;
const getMeta = async function ({ link, providerContext }) {
  const empty = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://www.xvideos.com/" }, timeout: 20000 });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $("h1").first().text().trim() || $("title").text().trim() || "Untitled";
    const image = $('meta[property="og:image"]').attr("content") || "";
    const links = [];
    const seen = new Set();
    // HLS (signed, works)
    const hls = (html.match(/html5player\.setVideoHLS\(['"]([^'"]+)/) || [])[1];
    if (hls && !seen.has(hls)) {
      seen.add(hls);
      links.push({ title: "Play", quality: "auto", directLinks: [{ title: "HLS", link: hls.replace(/&amp;/g, "&"), type: "movie" }] });
    }
    const hlsCdn = html.match(/https?:\/\/hls-cdn77\.xvideos-cdn\.com\/[^"'\s]+\.m3u8/gi) || [];
    for (const u of hlsCdn) {
      if (seen.has(u)) continue;
      seen.add(u);
      links.push({ title: "Play", quality: "auto", directLinks: [{ title: "HLS", link: u, type: "movie" }] });
    }
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList: links };
  } catch { return empty; }
};
exports.getMeta = getMeta;
