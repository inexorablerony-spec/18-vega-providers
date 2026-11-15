// @vega-provider spankbang
// @vega-version 1.0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeta = void 0;
const BASE = "https://spankbang.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";
function clean(value) { return value.replace(/&amp;/g, "&").replace(/\\u0026/g, "&").replace(/\\\//g, "/").trim(); }
function absoluteUrl(value) { const url = clean(value); if (url.startsWith("//")) return "https:" + url; if (url.startsWith("/")) return BASE + url; return url; }
const getMeta = async function ({ link, providerContext }) {
  const empty = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const match = link.match(/spankbang\.com\/([\da-z]+)\/(?:video|play|embed)/i);
    if (!match) return empty;
    const id = match[1];
    const videoPage = BASE + "/" + id + "/video";
    const response = await axios.get(videoPage, { headers: { "User-Agent": UA, "Referer": BASE + "/", "Cookie": "country=US" }, timeout: 25000 });
    const html = String(response.data || "");
    const $ = cheerio.load(html);
    const title = $("h1[title]").first().attr("title") || $("h1").first().text().trim() || $('meta[property="og:title"]').attr("content") || id;
    const image = $('meta[property="og:image"]').attr("content") || "";
    const linkList = [];
    const seen = new Set();
    function addSource(quality, rawUrl) {
      if (!rawUrl) return;
      const url = absoluteUrl(rawUrl);
      if (!/^https?:\/\//i.test(url)) return;
      if (seen.has(url)) return;
      if (!/\.(mp4|m3u8|mpd)(?:$|[?#])/i.test(url)) return;
      seen.add(url);
      linkList.push({ title: "Play (" + quality + ")", quality, directLinks: [{ title: quality, link: url, type: "movie" }] });
    }
    const streamRegex = /stream_url_([^\s=]+)\s*=\s*(["'])(.*?)\2/g;
    let streamMatch;
    while ((streamMatch = streamRegex.exec(html)) !== null) { addSource(streamMatch[1], streamMatch[3]); }
    if (linkList.length === 0) {
      const keyMatch = html.match(/data-streamkey\s*=\s*(["'])(.*?)\1/i);
      if (keyMatch) {
        const form = new URLSearchParams();
        form.append("id", keyMatch[2]);
        form.append("data", "0");
        const streamResponse = await axios.post(BASE + "/api/videos/stream", form.toString(), {
          headers: { "User-Agent": UA, "Referer": videoPage, "Origin": BASE, "X-Requested-With": "XMLHttpRequest", "Content-Type": "application/x-www-form-urlencoded", "Accept": "application/json, text/javascript, */*", "Cookie": "country=US" },
          timeout: 25000
        });
        let data = streamResponse.data;
        if (typeof data === "string") data = JSON.parse(data);
        if (data && typeof data === "object") {
          for (const [quality, value] of Object.entries(data)) {
            const rawUrl = Array.isArray(value) ? value[0] : value;
            if (typeof rawUrl === "string") addSource(quality, rawUrl);
          }
        }
      }
    }
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList };
  } catch { return empty; }
};
exports.getMeta = getMeta;
