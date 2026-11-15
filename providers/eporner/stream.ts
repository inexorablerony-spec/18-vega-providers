import { Stream } from "../types";
export const getStream = async function ({ link }: { link: string }): Promise<Stream[]> {
  if (!link) return [];
  // Only return if it's actually an MP4
  if (!link.includes(".mp4")) return [];
  return [{ server: "eporner", link: link, type: "mp4", headers: { Referer: "https://www.eporner.com/", "User-Agent": "Mozilla/5.0" } }];
};
