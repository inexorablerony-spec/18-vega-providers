// @vega-provider hqporner
// @vega-version 1.0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeta = void 0;
const getMeta = async function ({ link, providerContext }) {
  const empty = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
    const res = await axios.get(link, { headers: { "User-Agent": UA, Referer: "https://hqporner.com/" }, timeout: 25000 });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $("h1").first().text().trim() || $("title").text().trim() || "Untitled";
    const image = $('meta[property="og:image"]').attr("content") || "";
    const links = [];
    // Find mydaddy iframe specifically
    let iframe = "";
    $("iframe").each((_, el) => {
      const src = $(el).attr("src") || "";
      if (src.includes("mydaddy")) iframe = src;
    });
    if (!iframe) iframe = $("iframe").first().attr("src") || "";
    if (iframe.startsWith("//")) iframe = "https:" + iframe;
    if (iframe) {
      try {
        const pr = await axios.get(iframe, { headers: { "User-Agent": UA, Referer: link }, timeout: 20000 });
        const ph = String(pr.data || "");
        // Match protocol-relative and absolute mp4
        const raw = ph.match(/\/\/[a-z0-9]+\.bigcdn\.cc\/pubs\/[^"'\s]+\.mp4/gi) || [];
        const seen = new Set();
        for (const u of raw) {
          let url = "https:" + u;
          const clean = url.split("?")[0];
          if (seen.has(clean)) continue;
          seen.add(clean);
          const q = (url.match(/\/(\d{3,4})\.mp4/i) || [])[1] || "auto";
          links.push({ title: "Play (" + q + ")", quality: q, directLinks: [{ title: q + "p", link: url, type: "movie" }] });
        }
      } catch (e) {}
    }
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList: links };
  } catch { return empty; }
};
exports.getMeta = getMeta;
