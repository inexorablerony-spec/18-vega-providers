import { Stream } from "../types";
export const getStream = async function ({ link }: { link: string }): Promise<Stream[]> {
  if (!link) return [];
  return [{ server: "FreshPorno", link, type: "mp4", headers: { Referer: "https://freshporno.org/", "User-Agent": "Mozilla/5.0" } }];
};
