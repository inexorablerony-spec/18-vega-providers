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
export const getStream = async function ({ link, providerContext }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link) return [];
  const streams: Stream[] = [];
  try {
    const axios = providerContext?.axios;
    if (!axios) return [];
    const res = await axios.get(link, { headers: { "User-Agent": UA, Referer: REFERER }, timeout: 20000 });
    const playlist = extractPlaylist(res.data || "");
    if (!playlist || !Array.isArray(playlist.sources)) return [];
    for (const s of playlist.sources) {
      if (!s.file) continue;
      const url = resolve(String(s.file));
      const label = s.label || "auto";
      const isHls = s.type === "hls" || /\.m3u8/i.test(url);
      streams.push({ server: `NT2 ${label}`, link: url, type: isHls ? "m3u8" : "mp4", headers: { "User-Agent": UA, Referer: REFERER } });
    }
  } catch {}
  return streams;
};
