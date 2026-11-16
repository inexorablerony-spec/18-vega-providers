import { Stream, ProviderContext } from "../types";
const UA = "Mozilla/5.0";
const REFERER = "https://xhamster.com/";
export const getStream = async function ({ link }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link) return [];
  if (/\.(mp4|m3u8)(\?|$)/i.test(link)) {
    return [{ server: "T1 Direct", link, type: /\.m3u8/i.test(link) ? "m3u8" : "mp4", headers: { "User-Agent": UA, Referer: REFERER } }];
  }
  return [];
};
