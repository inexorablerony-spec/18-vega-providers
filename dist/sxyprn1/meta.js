// @vega-provider sxyprn1
// @vega-version 1.0
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeta = void 0;
function digitSum(v) { return (String(v).match(/[0-9]/g) || []).reduce((s, d) => s + Number(d), 0); }
function resolveVideoUrl(raw) {
  const parts = String(raw).split("/");
  if (parts.length < 8) return "";
  const host = "sxyprn.net";
  const sum6 = digitSum(parts[6]);
  const sum7 = digitSum(parts[7]);
  const token = Buffer.from(sum6 + "-" + host + "-" + sum7).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, ".");
  parts[1] += "5/" + token;
  const offset = Number(parts[5]);
  if (!Number.isFinite(offset)) return "";
  parts[5] = String(offset - sum6 - sum7);
  return "https://" + host + parts.join("/");
}
const getMeta = async function ({ link, providerContext }) {
  const empty = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": "Mozilla/5.0", Referer: "https://sxyprn.com/" }, timeout: 20000 });
    const html = String(res.data || "");
    const $ = cheerio.load(html);
    const title = $('meta[property="og:title"]').attr("content") || $("title").text().trim() || "SxyPrn";
    const image = $('meta[property="og:image"]').attr("content") || "";
    const links = [];
    $(".vidsnfo[data-vnfo]").each((_, el) => {
      try {
        const raw = $(el).attr("data-vnfo");
        if (!raw) return;
        const data = JSON.parse(raw);
        for (const [id, path] of Object.entries(data)) {
          const url = resolveVideoUrl(path);
          if (url) links.push({ title: "Play", quality: "auto", directLinks: [{ title: "MP4", link: url, type: "movie" }] });
        }
      } catch {}
    });
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList: links };
  } catch { return empty; }
};
exports.getMeta = getMeta;
