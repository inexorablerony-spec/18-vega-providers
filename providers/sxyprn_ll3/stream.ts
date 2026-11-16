import { Stream, ProviderContext } from "../types";
export const getStream = async function ({ link }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link) return [];
  return [
    { server: "LL3 1080p", link, type: "mp4", headers: { "User-Agent": "Mozilla/5.0", Referer: "https://sxyprn.com/" } },
    { server: "LL3 720p", link, type: "mp4", headers: { "User-Agent": "Mozilla/5.0", Referer: "https://sxyprn.com/" } },
    { server: "LL3 480p", link, type: "mp4", headers: { "User-Agent": "Mozilla/5.0", Referer: "https://sxyprn.com/" } }
  ];
};
