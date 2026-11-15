import { Stream } from "../types";
export const getStream = async function ({ link }: { link: string }): Promise<Stream[]> {
  if (!link || !/^https?:\/\//i.test(link)) return [];
  if (!link.includes(".mp4")) return [];
  return [{ server: "erome", link, type: "mp4", headers: { "User-Agent": "Mozilla/5.0", "Referer": "https://www.erome.com/", "Accept": "*/*" } }];
};
