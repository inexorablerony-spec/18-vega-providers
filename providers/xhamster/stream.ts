import { Stream } from "../types";
export const getStream = async function ({ link }: { link: string }): Promise<Stream[]> {
  if (!link) return [];
  return [{ server: "xHamster", link, type: link.includes(".m3u8") ? "m3u8" : "mp4", headers: { Referer: "https://xhamster.com/", "User-Agent": "Mozilla/5.0" } }];
};
