// @vega-provider spankbang1
// @vega-version 1.0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeta = void 0;
const getMeta = async function ({ link, providerContext }) {
  const empty = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://spankbang.com/" }, timeout: 20000 });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $("h1").first().text().trim() || "SpankBang";
    const image = $('meta[property="og:image"]').attr("content") || "";
    const links = [];
    const streamRegex = /stream_url_([^\s=]+)\s*=\s*["']([^"']+)["']/g;
    let m;
    while ((m = streamRegex.exec(html)) !== null) {
      let url = m[2].replace(/\\u0026/g, "&").replace(/\\\//g, "/");
      if (url.startsWith("//")) url = "https:" + url;
      if (url.includes(".mp4") || url.includes(".m3u8")) {
        links.push({ title: "Play (" + m[1] + ")", quality: m[1], directLinks: [{ title: m[1], link: url, type: "movie" }] });
      }
    }
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList: links };
  } catch { return empty; }
};
exports.getMeta = getMeta;
