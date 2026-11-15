import { Stream, ProviderContext } from "../types";
export const getStream = async function ({ link }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link) return [];
  return [{ server: "teen", link, type: link.includes("m3u8") ? "m3u8" : "mp4", headers: { Referer: "https://teenxy.com/" } }];
};
