import { Stream } from "../types";

export const getStream = async function ({ link }: { link: string }): Promise<Stream[]> {
  if (!link) return [];
  return [{
    server: "SxyPrn",
    link,
    type: "mp4",
    headers: { Referer: "https://sxyprn.com/", "User-Agent": "Mozilla/5.0" },
  }];
};
