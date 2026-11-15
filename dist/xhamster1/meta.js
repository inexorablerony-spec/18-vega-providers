// @vega-provider xhamster1
// @vega-version 1.0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeta = void 0;
const getMeta = async function ({ link, providerContext }) {
  const empty = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", Referer: "https://xhamster.com/" }, timeout: 20000 });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $('meta[property="og:title"]').attr("content") || $("h1").first().text().trim() || "XHamster";
    const image = $('meta[property="og:image"]').attr("content") || "";
    const links = [];
    // Try video sources
    $("video source, video").each((_, el) => {
      const src = $(el).attr("src") || $(el).attr("data-src") || "";
      if (src && (src.includes(".mp4") || src.includes(".m3u8"))) {
        let url = src.startsWith("//") ? "https:" + src : src;
        links.push({ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: url, type: "movie" }] });
      }
    });
    // Try JSON-LD
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const data = JSON.parse($(el).html() || "{}");
        if (data.contentUrl && (data.contentUrl.includes(".mp4") || data.contentUrl.includes(".m3u8"))) {
          links.push({ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: data.contentUrl, type: "movie" }] });
        }
      } catch {}
    });
    // Try window data
    const windowMatch = html.match(/window\.__INITIAL_STATE__\s*=\s*({[^;]+});/);
    if (windowMatch) {
      try {
        const state = JSON.parse(windowMatch[1]);
        if (state.video && state.video.sources) {
          for (const [q, url] of Object.entries(state.video.sources)) {
            if (typeof url === "string" && (url.includes(".mp4") || url.includes(".m3u8"))) {
              links.push({ title: "Play (" + q + ")", quality: q, directLinks: [{ title: q, link: url, type: "movie" }] });
            }
          }
        }
      } catch {}
    }
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList: links };
  } catch { return empty; }
};
exports.getMeta = getMeta;
