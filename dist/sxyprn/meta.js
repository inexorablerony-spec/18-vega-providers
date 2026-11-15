// @vega-provider sxyprn
// @vega-version 1.0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeta = void 0;
const getMeta = async function ({ link, providerContext }) {
  const empty = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
    const res = await axios.get(link, { headers: { "User-Agent": UA, Referer: "https://sxyprn.com/" }, timeout: 20000 });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $("h1").first().text().trim() || $("title").text().trim() || "Untitled";
    const image = $('meta[property="og:image"]').attr("content") || "";
    const links = [];
    const vnfo = (html.match(/data-vnfo=["']([^"']+)/) || [])[1];
    if (vnfo) {
      try {
        const decoded = Buffer.from(vnfo, "base64").toString("utf8");
        const urlMatch = decoded.match(/https?:\/\/[^"'\s]+/);
        if (urlMatch) links.push({ title: "Play", quality: "auto", directLinks: [{ title: "Video", link: urlMatch[0], type: "movie" }] });
      } catch {}
    }
    const sources = html.match(/https?:\/\/[^"'\s]+\.(mp4|m3u8)[^"'\s]*/gi) || [];
    for (const u of sources.slice(0, 3)) {
      if (!/preview|thumb|sprite/i.test(u)) {
        links.push({ title: "Play", quality: "auto", directLinks: [{ title: "Video", link: u.replace(/&amp;/g, "&"), type: "movie" }] });
      }
    }
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList: links };
  } catch { return empty; }
};
exports.getMeta = getMeta;
