// @vega-provider eporner-gvideo
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
    // Extract gvideo.eporner.com directly
    const gvideo = html.match(/https?:\/\/gvideo\.eporner\.com\/[^"'\s]+\.mp4/gi) || [];
    for (const u of gvideo) {
      links.push({ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: u, type: "movie" }] });
    }
    // Also try data-vid
    const dataVid = $('video').attr("data-vid") || "";
    if (dataVid && dataVid.includes(".mp4")) {
      const gvideoUrl = "https://gvideo.eporner.com/" + dataVid;
      if (!gvideo.includes(gvideoUrl)) {
        links.push({ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: gvideoUrl, type: "movie" }] });
      }
    }
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList: links };
  } catch { return empty; }
};
exports.getMeta = getMeta;
