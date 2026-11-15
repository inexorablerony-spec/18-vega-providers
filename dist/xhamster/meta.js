"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeta = void 0;
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
function absolute(value, base) { try { return new URL(value, base).href; } catch { return ""; } }
function readInitials(html) {
  const match = /window\.initials\s*=\s*/.exec(html);
  if (!match) return null;
  const start = match.index + match[0].length;
  if (html[start] !== "{") return null;
  let depth = 0, quoted = false, escaped = false;
  for (let i = start; i < html.length; i++) {
    const c = html[i];
    if (quoted) { if (escaped) escaped = false; else if (c === "\\") escaped = true; else if (c === '"') quoted = false; continue; }
    if (c === '"') quoted = true; else if (c === "{") depth++; else if (c === "}") { depth--; if (depth === 0) { try { return JSON.parse(html.slice(start, i + 1)); } catch { return null; } } }
  }
  return null;
}
function addSource(list, seen, raw, quality) {
  if (typeof raw !== "string") return;
  const url = raw.replace(/\\\//g, "/").replace(/&amp;/g, "&").trim();
  if (!/^https?:\/\//i.test(url) || !/\.(mp4|m3u8)(?:$|[?#])/i.test(url) || seen.has(url)) return;
  seen.add(url);
  const hls = /\.m3u8(?:$|[?#])/i.test(url);
  list.push({ title: `Play ${quality}`, quality, directLinks: [{ title: hls ? "HLS" : "MP4", link: url, type: hls ? "hls" : "movie" }] });
}
const getMeta = async function ({ link, providerContext }) {
  const empty = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const response = await axios.get(link, { headers: { "User-Agent": UA, Referer: "https://xhamster.com/", Accept: "text/html" }, timeout: 25000 });
    const html = String(response.data || "");
    const $ = cheerio.load(html);
    const initials = readInitials(html);
    const video = initials?.videoModel || {};
    const title = video.title || $('meta[property="og:title"]').attr("content") || $("h1").first().text().trim() || "XHamster Video";
    const image = absolute(video.thumbURL || $('meta[property="og:image"]').attr("content") || "", link);
    const synopsis = video.description || "";
    const list = [];
    const seen = new Set();
    const sources = video.sources || {};
    for (const [format, values] of Object.entries(sources)) {
      if (format === "download" || !values || typeof values !== "object") continue;
      for (const [quality, value] of Object.entries(values)) {
        const url = typeof value === "string" ? value : value?.url || value?.src;
        addSource(list, seen, url, quality);
      }
    }
    const player = initials?.xplayerSettings?.sources || {};
    if (player.hls) { addSource(list, seen, player.hls.url, "HLS"); addSource(list, seen, player.hls.fallback, "HLS"); }
    const standard = player.standard || {};
    for (const [format, items] of Object.entries(standard)) {
      if (!Array.isArray(items)) continue;
      for (const item of items) {
        const quality = String(item.quality || item.label || format);
        addSource(list, seen, item.url, quality);
        addSource(list, seen, item.fallback, quality);
      }
    }
    return { title, synopsis, image, imdbId: "", type: "movie", linkList: list };
  } catch { return empty; }
};
exports.getMeta = getMeta;
