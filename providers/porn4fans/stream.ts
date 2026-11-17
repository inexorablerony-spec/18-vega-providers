import { Stream, ProviderContext } from "../types";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export const getStream = async function ({ link }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link || !/^https?:\/\//i.test(link)) return [];
  if (!/\.mp4/i.test(link)) return [];
  return [{
    server: "porn4fans",
    link,
    type: "mp4",
    headers: { "User-Agent": UA, Referer: "https://www.porn4fans.com/", Accept: "*/*" },
  }];
};
