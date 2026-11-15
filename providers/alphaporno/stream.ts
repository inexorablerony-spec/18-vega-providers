import { Stream } from "../types";
export const getStream = async function ({ link }: { link: string }): Promise<Stream[]> {
  if (!link) return [];
  return [{ server: "alphaporno", link: link.replace(/&amp;/g, "&"), type: "mp4", headers: { Referer: "https://www.alphaporno.com/", "User-Agent": "Mozilla/5.0" } }];
};
