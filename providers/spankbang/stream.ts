import { Stream, ProviderContext } from "../types";
export const getStream = async function ({ link }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link) return [];
  const url = link.replace(/&amp;/g, "&");
  return [{ server: "spankbang", link: url, type: url.includes(".m3u8") ? "hls" : "mp4", headers: { Referer: "https://spankbang.com/", "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" } }];
};
