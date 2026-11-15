// @vega-provider erome
// @vega-version 1.0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeta = void 0;
const getMeta = async function ({ link, providerContext }) {
  const empty = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": "Mozilla/5.0", "Referer": "https://www.erome.com/" }, timeout: 20000 });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $("h1").first().text().trim() || $('meta[property="og:title"]').attr("content") || "Erome Album";
    const image = $('meta[property="og:image"]').attr("content") || "";
    const links = [];
    const seen = new Set();
    $("video").each((_, el) => {
      const video = $(el);
      const candidates = [video.attr("src"), video.attr("data-src"), video.find("source").attr("src"), video.find("source").attr("data-src")];
      for (const candidate of candidates) {
        if (!candidate) continue;
        let url = candidate.replace(/&amp;/g, "&").trim();
        if (url.startsWith("//")) url = "https:" + url;
        if (url.startsWith("/")) url = "https://www.erome.com" + url;
        if (!/^https?:\/\//i.test(url) || !/\.mp4(?:$|[?#])/i.test(url) || seen.has(url)) continue;
        seen.add(url);
        links.push({ title: "Play " + (links.length + 1), quality: "auto", directLinks: [{ title: "MP4", link: url, type: "movie" }] });
      }
    });
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList: links };
  } catch { return empty; }
};
exports.getMeta = getMeta;
