// @vega-provider wankoz
// @vega-version 1.1
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeta = void 0;
const getMeta = async function ({ link, providerContext }) {
  const empty = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const BASE = "https://www.wankoz.com";
    const res = await axios.get(link, { headers: { "User-Agent": "Mozilla/5.0", Referer: BASE + "/" }, timeout: 20000 });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $("h1").first().text().trim() || $("title").text().trim() || "Untitled";
    const image = $('meta[property="og:image"]').attr("content") || "";
    const links = [];
    const seen = new Set();
    // Look for get_file URLs (relative or absolute)
    const gf = html.match(/\/get_file\/[^"'\s]+\.mp4[^"'\s]*/gi) || [];
    for (const u of gf) {
      let clean = u.replace(/&amp;/g, "&");
      if (!clean.startsWith("http")) clean = BASE + clean;
      if (seen.has(clean)) continue;
      seen.add(clean);
      links.push({ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: clean, type: "movie" }] });
    }
    // Look for absolute mp4 URLs
    const mp4 = html.match(/https?:\/\/[^"'\s]+\.mp4[^"'\s]*/gi) || [];
    for (const u of mp4.slice(0, 5)) {
      const clean = u.replace(/&amp;/g, "&");
      if (seen.has(clean) || /thumb|preview|sprite/i.test(clean)) continue;
      seen.add(clean);
      links.push({ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: clean, type: "movie" }] });
    }
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList: links };
  } catch { return empty; }
};
exports.getMeta = getMeta;
