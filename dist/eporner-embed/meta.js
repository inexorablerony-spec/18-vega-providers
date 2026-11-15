// @vega-provider eporner-embed
// @vega-version 1.0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeta = void 0;
const getMeta = async function ({ link, providerContext }) {
  const empty = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    // Extract video ID and fetch embed page
    const vidMatch = link.match(/video-([^/]+)/);
    if (!vidMatch) return empty;
    const vid = vidMatch[1];
    const embedUrl = "https://www.eporner.com/embed/" + vid + "/";
    const res = await axios.get(embedUrl, { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://www.eporner.com/" }, timeout: 20000 });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $("title").text().trim() || "Untitled";
    const image = $('meta[property="og:image"]').attr("content") || "";
    const links = [];
    const mp4s = html.match(/https?:\/\/[^"'\s]+\.mp4/gi) || [];
    for (const u of mp4s) {
      if (/thumb|preview|static/i.test(u)) continue;
      links.push({ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: u, type: "movie" }] });
    }
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList: links };
  } catch { return empty; }
};
exports.getMeta = getMeta;
