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
    const seen = new Set();
    // Extract from contentUrl JSON-LD
    const contentUrl = (html.match(/"contentUrl":\s*"([^"]+\.mp4)"/) || [])[1];
    if (contentUrl && !seen.has(contentUrl)) {
      seen.add(contentUrl);
      links.push({ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: contentUrl, type: "movie" }] });
    }
    // Extract gvideo.eporner.com MP4s
    const gvideo = html.match(/https?:\/\/gvideo\.eporner\.com\/[^"'\s]+\.mp4/gi) || [];
    for (const u of gvideo) {
      if (seen.has(u)) continue;
      seen.add(u);
      links.push({ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: u, type: "movie" }] });
    }
    // Generic MP4 fallback
    const generic = html.match(/https?:\/\/[^"'\s]+\.mp4/gi) || [];
    for (const u of generic.slice(0, 3)) {
      if (seen.has(u) || /thumb|preview|sprite/i.test(u)) continue;
      seen.add(u);
      links.push({ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: u, type: "movie" }] });
    }
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList: links };
  } catch { return empty; }
};
exports.getMeta = getMeta;
