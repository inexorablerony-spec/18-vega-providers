// @vega-provider sxyprn
// @vega-version 1.0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeta = void 0;
const getMeta = async function ({ link, providerContext }) {
  const empty = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": "Mozilla/5.0", "Referer": "https://sxyprn.com/" }, timeout: 20000 });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $('meta[property="og:title"]').attr("content") || $("title").text().trim() || "SxyPrn Video";
    const image = $('meta[property="og:image"]').attr("content") || "";
    const links = [];
    const seen = new Set();
    $("video, video source").each((_, el) => {
      const node = $(el);
      const candidates = [node.attr("src"), node.attr("data-src")];
      for (const candidate of candidates) {
        if (!candidate) continue;
        let url = candidate.trim();
        if (url.startsWith("//")) url = "https:" + url;
        if (url.startsWith("/")) url = new URL(url, link).toString();
        if (!/^https?:\/\//i.test(url) || !/\.mp4(?:$|[?#])/i.test(url) || seen.has(url)) continue;
        seen.add(url);
        links.push({ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: url, type: "movie" }] });
      }
    });
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList: links };
  } catch { return empty; }
};
exports.getMeta = getMeta;
