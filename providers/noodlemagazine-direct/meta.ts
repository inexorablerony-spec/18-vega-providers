import { Info, ProviderContext } from "../types";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const BASE = "https://adult.noodlemagazine.com";

function extractPlaylist(html: string): any | null {
  const start = html.indexOf("window.playlist");
  if (start === -1) return null;
  const eq = html.indexOf("=", start);
  if (eq === -1) return null;
  const brace = html.indexOf("{", eq);
  if (brace === -1) return null;
  let depth = 0;
  let end = brace;
  for (let i = brace; i < html.length; i++) {
    if (html[i] === "{") depth++;
    else if (html[i] === "}") {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  try {
    return JSON.parse(html.slice(brace, end));
  } catch {
    return null;
  }
}

function resolveUrl(file: string): string {
  if (!file) return "";
  if (file.startsWith("http")) return file;
  if (file.startsWith("//")) return "https:" + file;
  if (file.startsWith("/")) return BASE + file;
  return BASE + "/" + file;
}

export const getMeta = async function ({
  link,
  providerContext,
}: {
  link: string;
  providerContext: ProviderContext;
}): Promise<Info> {
  try {
    const { axios } = providerContext;
    const res = await axios.get(link, {
      headers: { "User-Agent": UA, Referer: BASE + "/" },
      timeout: 20000,
    });
    const html = res.data || "";
    const title = html.match(/<title[^>]*>(.*?)<\/title>/i)?.[1] || "Noodle Magazine";
    const image = html.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i)?.[1] || "";

    const playlist = extractPlaylist(html);
    const linkList: any[] = [];
    if (playlist && Array.isArray(playlist.sources)) {
      for (const source of playlist.sources) {
        const file = source.file;
        if (!file) continue;
        const url = resolveUrl(file);
        const label = source.label || "auto";
        const isHls = source.type === "hls" || url.includes(".m3u8");
        linkList.push({
          title: label,
          quality: label,
          directLinks: [{ title: label, link: url, type: isHls ? "m3u8" : "mp4" }],
        });
      }
    }

    return {
      title,
      synopsis: "",
      image,
      imdbId: "",
      type: "movie",
      linkList,
    };
  } catch {
    return { title: "", synopsis: "", image: "", imdbId: "", type: "movie", linkList: [] };
  }
};
