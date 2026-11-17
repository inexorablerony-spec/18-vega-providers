import { Stream, ProviderContext } from "../types";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const BASE = "https://adult.noodlemagazine.com";
const REFERER = "https://noodlemagazine.com/";

function extractPlaylist(html: string): any | null {
  const marker = "window.playlist";
  const start = html.indexOf(marker);
  if (start === -1) return null;
  const braceStart = html.indexOf("{", start);
  if (braceStart === -1) return null;
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = braceStart; i < html.length; i++) {
    const c = html[i];
    if (escape) { escape = false; continue; }
    if (c === "\\") { escape = true; continue; }
    if (c === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (c === "{") depth++;
    if (c === "}") { depth--; if (depth === 0) { try { return JSON.parse(html.slice(braceStart, i + 1)); } catch { return null; } } }
  }
  return null;
}

function resolveUrl(file: string): string {
  if (file.startsWith("http")) return file;
  if (file.startsWith("//")) return "https:" + file;
  if (file.startsWith("/")) return BASE + file;
  return BASE + "/" + file;
}

function isPreview(url: string, label: string): boolean {
  const l = (url + " " + label).toLowerCase();
  return l.includes("preview") || l.includes("trailer") || l.includes("thumb");
}

async function expandHls(url: string, axios: any, label: string): Promise<Stream[]> {
  const out: Stream[] = [];
  const headers = { "User-Agent": UA, Referer: REFERER };
  try {
    const res = await axios.get(url, { headers, timeout: 15000 });
    const text = res.data || "";
    if (!text.includes("#EXT-X-STREAM-INF")) {
      out.push({ server: `Noodle ${label}`, link: url, type: "m3u8", headers });
      return out;
    }
    const lines = text.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line.startsWith("#EXT-X-STREAM-INF")) continue;
      const resMatch = line.match(/RESOLUTION=(\d+)x(\d+)/i);
      const next = (lines[i + 1] || "").trim();
      if (!next || next.startsWith("#")) continue;
      const variant = next.startsWith("http") ? next : new URL(next, url).toString();
      const height = resMatch ? resMatch[2] : "";
      const q = height ? height + "p" : label;
      out.push({ server: `Noodle ${q}`, link: variant, type: "m3u8", headers });
    }
  } catch {}
  if (out.length === 0) {
    out.push({ server: `Noodle ${label}`, link: url, type: "m3u8", headers });
  }
  return out;
}

export const getStream = async function ({ link, providerContext }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link) return [];
  const streams: Stream[] = [];
  const seen = new Set<string>();
  try {
    const axios = providerContext?.axios;
    if (!axios) return [];
    const res = await axios.get(link, { headers: { "User-Agent": UA, Referer: REFERER, Accept: "text/html,application/xhtml+xml" }, timeout: 25000 });
    const html = res.data || "";
    const playlist = extractPlaylist(html);
    if (playlist && Array.isArray(playlist.sources)) {
      for (const source of playlist.sources) {
        const file = source && source.file;
        if (!file) continue;
        const url = resolveUrl(String(file));
        const label = (source.label && String(source.label)) || "auto";
        if (isPreview(url, label)) continue;
        if (seen.has(url)) continue;
        seen.add(url);
        const isHls = source.type === "hls" || /\.m3u8/i.test(url);
        if (isHls) {
          const variants = await expandHls(url, axios, label);
          for (const v of variants) {
            if (!seen.has(v.link)) {
              seen.add(v.link);
              streams.push(v);
            }
          }
        } else {
          streams.push({ server: `Noodle ${label}`, link: url, type: "mp4", headers: { "User-Agent": UA, Referer: REFERER } });
        }
      }
    }
  } catch {}
  return streams;
};
