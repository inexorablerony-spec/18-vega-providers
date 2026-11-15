// @vega-provider eporner
// @vega-version 1.3
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeta = void 0;
const getMeta = async function ({ link, providerContext }) {
  const empty = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", Referer: "https://www.eporner.com/" }, timeout: 20000 });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $("h1").first().text().trim() || $("title").text().trim() || "Untitled";
    const image = $('meta[property="og:image"]').attr("content") || "";
    const links = [];
    const seen = new Set();
    const contentUrl = (html.match(/"contentUrl":\s*"([^"]+\.mp4)"/) || [])[1];
    if (contentUrl && !seen.has(contentUrl)) {
      seen.add(contentUrl);
      links.push({ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: contentUrl, type: "movie" }] });
    }
    const dataVid = $('video').attr("data-vid") || "";
    if (dataVid && dataVid.includes(".mp4")) {
      const gvideoUrl = "https://gvideo.eporner.com/" + dataVid;
      if (!seen.has(gvideoUrl)) {
        seen.add(gvideoUrl);
        links.push({ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: gvideoUrl, type: "movie" }] });
      }
    }
    const gvideo = html.match(/https?:\/\/gvideo\.eporner\.com\/[^"'\s]+\.mp4/gi) || [];
    for (const u of gvideo) {
      if (seen.has(u)) continue;
      seen.add(u);
      links.push({ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: u, type: "movie" }] });
    }
    const mp4s = html.match(/https?:\/\/[^"'\s]+\.mp4/gi) || [];
    for (const u of mp4s) {
      if (seen.has(u) || /thumb|preview|sprite|static/i.test(u)) continue;
      seen.add(u);
      links.push({ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: u, type: "movie" }] });
    }
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList: links };
  } catch { return empty; }
};
exports.getMeta = getMeta;
