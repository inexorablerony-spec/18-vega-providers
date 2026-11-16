import { Stream } from "../types";

export async function getStream({ link }: { link: string }): Promise<Stream[]> {
  if (!link) return [];
  const lower = link.toLowerCase();
  const type = lower.includes(".m3u8") ? "m3u8" : "mp4";
  return [{
    server: "pornxp",
    link,
    type,
    headers: { "User-Agent": "Mozilla/5.0", Referer: "https://pornxp.com/" },
  }];
}
