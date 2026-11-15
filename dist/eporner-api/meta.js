// @vega-provider eporner-api
// @vega-version 1.0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeta = void 0;
const getMeta = async function ({ link, providerContext }) {
  const empty = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios } = providerContext;
    // Extract video ID and use API
    const vidMatch = link.match(/video-([^/]+)/);
    if (!vidMatch) return empty;
    const vid = vidMatch[1];
    const apiUrl = "https://www.eporner.com/api/v2/video/id/?id=" + vid;
    const res = await axios.get(apiUrl, { headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" }, timeout: 20000 });
    let data = res.data;
    if (typeof data === "string") { try { data = JSON.parse(data); } catch { return empty; } }
    const title = data.title || "Untitled";
    const image = data.default_thumb?.src || "";
    const links = [];
    // API might have embed or direct URL
    if (data.embed) {
      links.push({ title: "Embed", quality: "auto", directLinks: [{ title: "Embed", link: data.embed, type: "movie" }] });
    }
    if (data.url) {
      links.push({ title: "Page", quality: "auto", directLinks: [{ title: "Page", link: data.url, type: "movie" }] });
    }
    return { title, synopsis: data.keywords || "", image, imdbId: "", type: "movie", linkList: links };
  } catch { return empty; }
};
exports.getMeta = getMeta;
