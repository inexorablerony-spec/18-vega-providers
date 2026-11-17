import { Info, ProviderContext } from "../types";

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

export const getMeta = async function ({ link, providerContext }: { link: string; providerContext: ProviderContext }): Promise<Info> {
  try {
    const { axios } = providerContext;
    const res = await axios.get(link, { headers: { "User-Agent": UA, Referer: REFERER }, timeout: 15000 });
    const html = res.data || "";
    const title = html.match(/<title[^>]*>(.*?)<\/title>/i)?.[1] || "Noodle Test 1";
    const image = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i)?.[1] || "";
    const linkList: any[] = [];
    const playlist = extractPlaylist(html);
    if (playlist && Array.isArray(playlist.sources)) {
      for (const source of playlist.sources) {
        if (source.file) {
          const url = resolveUrl(String(source.file));
          const quality = source.label || "Auto";
          linkList.push({ title: quality, quality, directLinks: [{ title: quality, link: url, type: url.includes(".m3u8") ? "m3u8" : "mp4" }] });
        }
      }
    }
    return { title, synopsis: "", image, imdbId: "", type: "movie", linkList };
  } catch { return { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] }; }
};
