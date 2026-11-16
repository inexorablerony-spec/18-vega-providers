import { Stream, ProviderContext } from "../types";
const UA = "Mozilla/5.0";
const REFERER = "https://sxyprn.com/";
export const getStream = async function ({ link }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link) return [];
  if (/\.(mp4|m3u8|vid)(\?|$)/i.test(link)) {
    return [{ server: "SP1 Direct", link, type: /\.m3u8/i.test(link) ? "m3u8" : "mp4", headers: { "User-Agent": UA, Referer: REFERER } }];
  }
  return [];
};
