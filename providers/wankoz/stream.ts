import { Stream, ProviderContext } from "../types";
export const getStream = async function ({ link }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link) return [];
  const url = link.replace(/&amp;/g, "&");
  const m = url.match(/_(\d{3,4})p/i);
  let quality: Stream["quality"];
  if (m) { const n = m[1]; quality = n === "2160" ? "2160" : n === "1080" ? "1080" : n === "720" ? "720" : n === "480" ? "480" : "360"; }
  return [{ server: "wankoz", link: url, type: "mp4", quality, headers: { Referer: "https://www.wankoz.com/", "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" } }];
};
