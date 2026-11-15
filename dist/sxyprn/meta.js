// @vega-provider sxyprn
// @vega-version 1.2
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeta = void 0;

function digitSum(value) {
  return (value.match(/\d/g) || []).reduce((sum, digit) => sum + Number(digit), 0);
}

function resolveVideoUrl(rawPath) {
  const parts = String(rawPath).split("/");
  if (parts.length < 8) return "";
  const host = "sxyprn.net";
  const sum6 = digitSum(parts[6]);
  const sum7 = digitSum(parts[7]);
  const token = Buffer.from(`${sum6}-${host}-${sum7}`).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, ".");
  parts[1] += `5/${token}`;
  const offset = Number(parts[5]);
  if (!Number.isFinite(offset)) return "";
  parts[5] = String(offset - sum6 - sum7);
  return `https://${host}${parts.join("/")}`;
}

const getMeta = async function ({ link, providerContext }) {
  const empty = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": "Mozilla/5.0", "Referer": "https://sxyprn.com/" }, timeout: 20000 });
    const $ = cheerio.load(String(res.data || ""));
    const title = $(".PostEditTA").first().text().trim() || $('meta[property="og:title"]').attr("content") || $("title").text().trim() || "SxyPrn Video";
    const image = $('meta[property="og:image"]').attr("content") || "";
    const player = $("#player_el").first();
    const activeId = player.attr("data-postid") || (new URL(link).pathname.match(/\/post\/([^/.]+)/i) || [])[1] || "";
    const maps = [];
    $(".vidsnfo[data-vnfo]").each((_, el) => {
      try {
        const raw = $(el).attr("data-vnfo");
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") maps.push(parsed);
      } catch {}
    });
    let rawPath = "";
    if (activeId) {
      for (const map of maps) {
        if (typeof map[activeId] === "string") { rawPath = map[activeId]; break; }
      }
    }
    if (!rawPath && maps.length === 1) {
      const ids = Object.keys(maps[0]);
      if (ids.length === 1) rawPath = maps[0][ids[0]];
    }
    let videoUrl = rawPath ? resolveVideoUrl(rawPath) : "";
    if (!videoUrl) {
      const candidates = [player.attr("src"), player.attr("data-puri"), player.find("source").first().attr("src")];
      for (const candidate of candidates) {
        if (!candidate) continue;
        const url = new URL(candidate, link).toString();
        if (/\.vid|\.mp4|\/cdn5?\/|\/vidi\//i.test(url)) { videoUrl = url; break; }
      }
    }
    if (!videoUrl || !/^https?:\/\//i.test(videoUrl) || !/\.vid|\.mp4|\/cdn5?\/|\/vidi\//i.test(videoUrl)) {
      return { ...empty, title, image };
    }
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList: [{ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: videoUrl, type: "movie" }] }] };
  } catch { return empty; }
};
exports.getMeta = getMeta;
