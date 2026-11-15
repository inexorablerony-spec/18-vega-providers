// @vega-provider eporner
// @vega-version 1.1
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeta = void 0;
const getMeta = async function ({ link, providerContext }) {
  const empty = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, { 
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", Referer: "https://www.eporner.com/" }, 
      timeout: 20000 
    });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $("h1").first().text().trim() || $("title").text().trim() || "Untitled";
    const image = $('meta[property="og:image"]').attr("content") || "";
    const links = [];
    // Extract video ID from URL
    const vid = (link.match(/video-([a-zA-Z0-9]+)/) || link.match(/\/([a-zA-Z0-9]{8,})\//) || [])[1];
    if (vid) {
      // Construct gvideo URL
      const gvideo = "https://gvideo.eporner.com/" + vid + "/" + vid + ".mp4";
      links.push({ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: gvideo, type: "movie" }] });
    }
    // Also try contentUrl
    const contentUrl = (html.match(/"contentUrl":\s*"([^"]+\.mp4)"/) || [])[1];
    if (contentUrl && contentUrl.includes("gvideo")) {
      links.push({ title: "Play (alt)", quality: "auto", directLinks: [{ title: "MP4", link: contentUrl, type: "movie" }] });
    }
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList: links };
  } catch { return empty; }
};
exports.getMeta = getMeta;
