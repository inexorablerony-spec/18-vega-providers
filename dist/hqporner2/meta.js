// @vega-provider hqporner2
// @vega-version 1.0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeta = void 0;
const getMeta = async function ({ link, providerContext }) {
  const empty = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }, timeout: 20000 });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $("h1").first().text().trim() || "Untitled";
    const image = $('meta[property="og:image"]').attr("content") || "";
    const links = [];
    const seen = new Set();
    // Extract mydaddy iframe
    let iframe = $('iframe[src*="mydaddy"]').attr("src") || "";
    if (!iframe) iframe = (html.match(/src="(\/\/mydaddy[^"]+)"/) || [])[1] || "";
    if (iframe) {
      const iframeUrl = iframe.startsWith("//") ? "https:" + iframe : iframe;
      try {
        const iframeRes = await axios.get(iframeUrl, { headers: { "User-Agent": "Mozilla/5.0", Referer: link }, timeout: 15000 });
        const iframeHtml = String(iframeRes.data || "");
        const mp4s = iframeHtml.match(/\/\/[^"'\s]+\.mp4/gi) || [];
        for (const u of mp4s) {
          const full = "https:" + u.replace(/\\/g, "").replace(/&amp;/g, "&");
          if (seen.has(full) || /thumb|preview|tile|main\.jpg/i.test(full)) continue;
          seen.add(full);
          const quality = full.includes("/1080") ? "1080p" : full.includes("/720") ? "720p" : "360p";
          links.push({ title: "Play (" + quality + ")", quality: quality, directLinks: [{ title: "MP4", link: full, type: "movie" }] });
        }
      } catch {}
    }
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList: links };
  } catch { return empty; }
};
exports.getMeta = getMeta;
