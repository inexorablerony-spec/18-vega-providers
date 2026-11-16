import { Stream, ProviderContext } from "../types";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
const REFERER = "https://noodlemagazine.com/";
const BASE = "https://adult.noodlemagazine.com";
function extractPlaylist(html: string): any | null {
  const start = html.indexOf("window.playlist");
  if (start === -1) return null;
  const eq = html.indexOf("=", start);
  if (eq === -1) return null;
  let i = eq + 1;
  while (i < html.length && /\s/.test(html[i])) i++;
  if (html[i] !== "{") return null;
  let depth = 0;
  const braceStart = i;
  for (; i < html.length; i++) {
    if (html[i] === "{") depth++;
    else if (html[i] === "}") { depth--; if (depth === 0) { try { return JSON.parse(html.slice(braceStart, i + 1)); } catch { return null; } } }
  }
  return null;
}
function resolve(file: string): string {
  if (!file) return "";
  if (/^https?:\/\//i.test(file)) return file;
  if (file.startsWith("//")) return "https:" + file;
  if (file.startsWith("/")) return BASE + file;
  return BASE + "/" + file;
}
function isPreview(url: string, label: string): boolean {
  const l = (url + " " + label).toLowerCase();
  return l.includes("preview") || l.includes("trailer") || l.includes("thumb");
}
export const getStream = async function ({ link, providerContext }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link) return [];
  const streams: Stream[] = [];
  const seen = new Set<string>();
  const headers = { "User-Agent": UA, Referer: REFERER };
  try {
    const axios = providerContext?.axios;
    if (!axios) return [];
    if (/\.(mp4|m3u8)(\?|$)/i.test(link) && !isPreview(link, "")) {
      streams.push({ server: "NT5 Direct", link, type: /\.m3u8/i.test(link) ? "m3u8" : "mp4", headers });
      seen.add(link);
    }
    const res = await axios.get(link, { headers, timeout: 20000 });
    const html = res.data || "";
    const playlist = extractPlaylist(html);
    if (playlist && Array.isArray(playlist.sources)) {
      for (const s of playlist.sources) {
        if (!s.file) continue;
        const url = resolve(String(s.file));
        const label = s.label || "auto";
        if (isPreview(url, label) || seen.has(url)) continue;
        seen.add(url);
        const isHls = s.type === "hls" || /\.m3u8/i.test(url);
        streams.push({ server: `NT5 ${label}`, link: url, type: isHls ? "m3u8" : "mp4", headers });
      }
    }
  } catch {}
  return streams;
};
