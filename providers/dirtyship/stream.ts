import { Stream, ProviderContext } from "../types";
const UA = "Mozilla/5.0";

export const getStream = async function ({ link }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link || !/^https?:\/\//i.test(link)) return [];
  if (!/\.mp4/i.test(link)) return [];
  return [{
    server: "dirtyship",
    link,
    type: "mp4",
    headers: { "User-Agent": UA, Referer: "https://dirtyship.com/", Accept: "*/*" },
  }];
};
