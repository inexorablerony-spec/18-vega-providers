// @vega-provider pornhub
// @vega-version 1.0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeta = void 0;
const getMeta = async function ({ link, providerContext }) {
  const empty = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }, timeout: 20000 });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $("h1").first().text().trim() || $("title").text().trim() || "Untitled";
    const image = $('meta[property="og:image"]').attr("content") || "";
    const links = [];
    // Extract flashvars
    const flashvarsMatch = html.match(/flashvars_\d+\s*=\s*({[^}]+})/);
    if (flashvarsMatch) {
      try {
        const flashvars = JSON.parse(flashvarsMatch[1]);
        const mediaDefs = flashvars.mediaDefinitions || [];
        for (const def of mediaDefs) {
          if (def.videoUrl && def.quality) {
            links.push({ title: "Play (" + def.quality + ")", quality: def.quality, directLinks: [{ title: "MP4", link: def.videoUrl, type: "movie" }] });
          }
        }
      } catch {}
    }
    // Fallback: look for video URLs
    const mp4s = html.match(/https?:\/\/[^"'\s]+\.mp4[^"'\s]*/gi) || [];
    for (const u of mp4s.slice(0, 3)) {
      if (/thumb|preview/i.test(u)) continue;
      links.push({ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: u, type: "movie" }] });
    }
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList: links };
  } catch { return empty; }
};
exports.getMeta = getMeta;
