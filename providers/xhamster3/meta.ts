import { Info, ProviderContext } from "../types";
const BASE = "https://xhamster3.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36";
function parseInitialState(html: string): any {
  const match = /window\.initials\s*=\s*/.exec(html);
  if (!match) return null;
  const start = match.index + match[0].length;
  if (html[start] !== "{") return null;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < html.length; i++) {
    const c = html[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (c === "\\") escaped = true;
      else if (c === '"') inString = false;
      continue;
    }
    if (c === '"') inString = true;
    else if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) {
        try { return JSON.parse(html.substring(start, i + 1)); } catch { return null; }
      }
    }
  }
  return null;
}
function makeLinks(output: Info["linkList"], seen: Set<string>, value: any, quality: string) {
  if (typeof value !== "string") return;
  const url = value.replace(/\\\//g, "/").trim();
  if (!/^https?:\/\//i.test(url)) return;
  if (!/\.(mp4|m3u8)(?:$|[?#])/i.test(url)) return;
  if (seen.has(url)) return;
  seen.add(url);
  const isHls = /\.m3u8(?:$|[?#])/i.test(url);
  output.push({ title: "Play " + quality, quality, directLinks: [{ title: isHls ? "HLS" : "MP4", link: url, type: isHls ? "hls" : "movie" }] });
}
export async function getMeta({ link, providerContext }: { link: string; providerContext: ProviderContext }): Promise<Info> {
  const empty: Info = { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  try {
    const { axios, cheerio } = providerContext;
    const response = await axios.get(link, { headers: { "User-Agent": UA, "Referer": BASE + "/", "Accept": "text/html,application/xhtml+xml" }, timeout: 25000 });
    const html = String(response.data || "");
    const $ = cheerio.load(html);
    const state = parseInitialState(html);
    const video = state?.videoModel || {};
    const title = video.title || $('meta[property="og:title"]').attr("content") || $("h1").first().text().trim() || "";
    const image = video.thumbURL || $('meta[property="og:image"]').attr("content") || "";
    const synopsis = video.description || $('meta[name="description"]').attr("content") || "";
    const links: Info["linkList"] = [];
    const seen = new Set<string>();
    const sources = video.sources || {};
    for (const [format, qualities] of Object.entries(sources)) {
      if (format === "download") continue;
      if (!qualities || typeof qualities !== "object") continue;
      for (const [quality, source] of Object.entries(qualities as any)) {
        const value = typeof source === "string" ? source : source?.url || source?.src;
        makeLinks(links, seen, value, quality);
      }
    }
    const player = state?.xplayerSettings?.sources || {};
    if (player.hls) {
      makeLinks(links, seen, player.hls.url, "HLS");
      makeLinks(links, seen, player.hls.fallback, "HLS");
    }
    for (const [format, items] of Object.entries(player.standard || {})) {
      if (!Array.isArray(items)) continue;
      for (const item of items as any[]) {
        const quality = String(item.quality || item.label || format);
        makeLinks(links, seen, item.url, quality);
        makeLinks(links, seen, item.fallback, quality);
      }
    }
    $("video source, video").each((_: any, node: any) => {
      const el = $(node);
      const url = el.attr("src") || el.attr("data-src") || "";
      makeLinks(links, seen, url, "Auto");
    });
    return { title: title || "XHamster 3 video", synopsis, image: absolute(image, link), imdbId: "", type: "movie", linkList: links };
  } catch { return empty; }
}
function absolute(value: string, base: string): string {
  try { return new URL(value, base).href; } catch { return ""; }
}
