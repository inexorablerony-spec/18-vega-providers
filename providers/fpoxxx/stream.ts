import { Stream } from "../types";
export const getStream = async function ({ link }: { link: string }): Promise<Stream[]> {
  if (!link) return [];
  return [{ server: "FpoXxx", link, type: "mp4", headers: { Referer: "https://www.fpo.xxx/", "User-Agent": "Mozilla/5.0" } }];
};
