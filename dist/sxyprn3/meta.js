// @vega-provider sxyprn3
// @vega-version 1.0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeta = void 0;
const getMeta = async function ({ link, providerContext }) {
  const empty = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://sxyprn.com/" }, timeout: 20000 });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $('meta[property="og:title"]').attr("content") || $("title").text().trim() || "SxyPrn";
    const image = $('meta[property="og:image"]').attr("content") || "";
    const links = [];
    const poster = $("video").attr("poster") || "";
    if (poster) {
      let url = poster.startsWith("//") ? "https:" + poster : poster;
      url = url.replace(/full\.jpg$/, "video.mp4").replace(/\.jpg$/, ".mp4");
      links.push({ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: url, type: "movie" }] });
    }
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList: links };
  } catch { return empty; }
};
exports.getMeta = getMeta;
