// @vega-provider spankbang3
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
    const iframe = $("iframe[src*='embed']").attr("src") || "";
    if (iframe) {
      const iframeUrl = iframe.startsWith("//") ? "https:" + iframe : iframe;
      const iframeRes = await axios.get(iframeUrl, { headers: { "User-Agent": "Mozilla/5.0", Referer: link }, timeout: 15000 });
      const iframeHtml = String(iframeRes.data || "");
      const mp4s = iframeHtml.match(/https?:\/\/[^"'\s]+\.mp4[^"'\s]*/gi) || [];
      for (const u of mp4s) {
        if (/thumb|preview/i.test(u)) continue;
        links.push({ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: u, type: "movie" }] });
      }
    }
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList: links };
  } catch { return empty; }
};
exports.getMeta = getMeta;
