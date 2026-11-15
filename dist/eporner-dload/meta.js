// @vega-provider eporner-dload
// @vega-version 1.0
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
    const dloads = html.match(/\/dload\/[^"'\s]+\.mp4/gi) || [];
    for (const u of dloads) {
      const full = "https://www.eporner.com" + u;
      const quality = u.includes("/1080/") ? "1080p" : u.includes("/720/") ? "720p" : u.includes("/480/") ? "480p" : "360p";
      links.push({ title: "Play (" + quality + ")", quality: quality, directLinks: [{ title: "MP4", link: full, type: "movie" }] });
    }
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList: links };
  } catch { return empty; }
};
exports.getMeta = getMeta;
