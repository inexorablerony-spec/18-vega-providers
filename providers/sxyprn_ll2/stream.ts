import { Stream, ProviderContext } from "../types";
export const getStream = async function ({ link }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link) return [];
  return [{ server: "LL2", link, type: "mp4", headers: { "User-Agent": "Mozilla/5.0", Referer: "https://sxyprn.com/" } }];
};
