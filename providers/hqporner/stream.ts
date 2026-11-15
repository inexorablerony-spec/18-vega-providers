import { Stream } from "../types";
export const getStream = async function ({ link }: { link: string }): Promise<Stream[]> {
  if (!link) return [];
  // Only return if it's actually an MP4
  if (!link.includes(".mp4")) return [];
  return [{ server: "hqporner", link: link, type: "mp4", headers: { Referer: "https://mydaddy.cc/", "User-Agent": "Mozilla/5.0" } }];
};
