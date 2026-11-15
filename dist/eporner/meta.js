// @vega-provider eporner
// @vega-version 1.4
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
    const dloads = html.match(/\/dload\/[^"'\s]+\.mp4/gi) || [];
    for (const u of dloads) {
      const full = "https://www.eporner.com" + u;
      if (seen.has(full)) continue;
      seen.add(full);
      const quality = u.includes("/1080/") ? "1080p" : u.includes("/720/") ? "720p" : u.includes("/480/") ? "480p" : u.includes("/360/") ? "360p" : "240p";
      links.push({ title: "Play (" + quality + ")", quality: quality, directLinks: [{ title: "MP4", link: full, type: "movie" }] });
    }
    const contentUrl = (html.match(/"contentUrl":\s*"([^"]+\.mp4)"/) || [])[1];
    if (contentUrl && !seen.has(contentUrl)) {
      seen.add(contentUrl);
      links.push({ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: contentUrl, type: "movie" }] });
    }
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList: links };
  } catch { return empty; }
};
exports.getMeta = getMeta;
