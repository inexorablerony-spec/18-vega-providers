// @vega-provider xhamster2
// @vega-version 1.1
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeta = void 0;
const getMeta = async function ({ link, providerContext }) {
  const empty = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", Referer: "https://xhamster.com/", Accept: "text/html" }, timeout: 20000 });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $('meta[property="og:title"]').attr("content") || $("h1").first().text().trim() || $("title").text().trim() || "XHamster";
    const image = $('meta[property="og:image"]').attr("content") || "";
    const links = [];
    const seen = new Set();
    $("video source, video").each((_, el) => {
      const src = $(el).attr("src") || $(el).attr("data-src") || "";
      if (src && (src.includes(".mp4") || src.includes(".m3u8"))) {
        let url = src.startsWith("//") ? "https:" + src : src;
        if (!seen.has(url)) { seen.add(url); links.push({ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: url, type: "movie" }] }); }
      }
    });
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const data = JSON.parse($(el).html() || "{}");
        const items = Array.isArray(data) ? data : [data];
        for (const item of items) {
          if (item.contentUrl && (item.contentUrl.includes(".mp4") || item.contentUrl.includes(".m3u8"))) {
            if (!seen.has(item.contentUrl)) { seen.add(item.contentUrl); links.push({ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: item.contentUrl, type: "movie" }] }); }
          }
        }
      } catch {}
    });
    const initialsMatch = html.match(/window\.initials\s*=\s*({.+?});/s);
    if (initialsMatch) {
      try {
        const initials = JSON.parse(initialsMatch[1]);
        if (initials.video && initials.video.sources) {
          for (const [q, url] of Object.entries(initials.video.sources)) {
            if (typeof url === "string" && (url.includes(".mp4") || url.includes(".m3u8"))) {
              if (!seen.has(url)) { seen.add(url); links.push({ title: "Play (" + q + ")", quality: q, directLinks: [{ title: q, link: url, type: "movie" }] }); }
            }
          }
        }
      } catch {}
    }
    const mp4s = html.match(/https?:\/\/[^"'\s]+\.(mp4|m3u8)[^"'\s]*/gi) || [];
    for (const u of mp4s) {
      if (seen.has(u) || /thumb|preview|sprite/i.test(u)) continue;
      seen.add(u);
      links.push({ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: u, type: "movie" }] });
    }
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList: links };
  } catch { return empty; }
};
exports.getMeta = getMeta;
