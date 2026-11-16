import { Stream, ProviderContext } from "../types";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
const REFERER = "https://noodlemagazine.com/";
export const getStream = async function ({ link, providerContext }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link) return [];
  if (/\.(mp4|m3u8)(\?|$)/i.test(link)) {
    return [{ server: "NT1 Direct", link, type: /\.m3u8/i.test(link) ? "m3u8" : "mp4", headers: { "User-Agent": UA, Referer: REFERER } }];
  }
  return [];
};
