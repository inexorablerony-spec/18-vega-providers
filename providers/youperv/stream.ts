import { Stream } from "../types";
export const getStream = async function ({ link }: { link: string }): Promise<Stream[]> {
  if (!link) return [];
  return [{ server: "YouPerv", link: link.replace(/ /g, "%20"), type: "mp4", headers: { Referer: "https://youperv.com/", "User-Agent": "Mozilla/5.0" } }];
};
