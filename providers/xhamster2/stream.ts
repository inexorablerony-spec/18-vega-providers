import { Stream } from "../types";
export const getStream = async function ({ link }: { link: string }): Promise<Stream[]> {
  if (!link || !/^https?:\/\//i.test(link)) return [];
  if (!/\.(mp4|m3u8)/i.test(link)) return [];
  return [{ server: "xhamster2", link, type: link.includes(".m3u8") ? "m3u8" : "mp4", headers: { Referer: "https://xhamster.com/", "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" } }];
};
