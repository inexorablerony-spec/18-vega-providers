// @vega-provider pornicom
// @vega-version 1.0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeta = void 0;
const getMeta = async function ({ link, providerContext }) {
  const empty = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
    const res = await axios.get(link, { headers: { "User-Agent": UA, Referer: "https://www.pornicom.com/" }, timeout: 20000 });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $("h1").first().text().trim() || $("title").text().trim() || "Untitled";
    const image = $('meta[property="og:image"]').attr("content") || "";
    const links = [];
    const seen = new Set();
    const re = /https?:\/\/[^"']+\/get_file\/[^"']+\.mp4[^"']*/gi;
    for (const m of html.matchAll(re)) {
      let u = m[0].replace(/&amp;/g, "&");
      const clean = u.split("?")[0];
      if (seen.has(clean)) continue;
      seen.add(clean);
      const q = (u.match(/_(\d{3,4})p/i) || [])[1];
      links.push({ title: q ? "Play (" + q + "p)" : "Play", quality: q ? q + "p" : "auto", directLinks: [{ title: "MP4", link: u, type: "movie" }] });
    }
    const vu = (html.match(/video_url:\s*['"]([^'"]+)/) || [])[1];
    if (vu && !seen.has(vu.split("?")[0])) {
      links.push({ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: vu.replace(/&amp;/g, "&"), type: "movie" }] });
    }
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList: links };
  } catch { return empty; }
};
exports.getMeta = getMeta;
