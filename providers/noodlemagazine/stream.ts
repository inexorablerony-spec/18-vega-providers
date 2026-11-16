import { Stream, ProviderContext } from "../types";

export const getStream = async function ({ link, providerContext }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link) return [];
  try {
    const axios = providerContext?.axios;
    if (!axios) return [{ server: "Noodle Magazine", link, type: "mp4", headers: { "User-Agent": "Mozilla/5.0", Referer: "https://noodlemagazine.com/" } }];
    const res = await axios.get(link, { headers: { "User-Agent": "Mozilla/5.0" }, timeout: 15000 });
    const html = res.data || "";
    const matches = html.match(/https?:\\?\/\\?\/[^"'\\\s]+?\.(?:mp4|m3u8)(?:\?[^"'\\\s]*)?/gi) || [];
    const unique = [...new Set(matches.map((l: any) => l.replace(/\\\//g, "/")))];
    if (unique.length) {
      return unique.map((l: any) => ({
        server: "Noodle Magazine",
        link: l,
        type: l.includes(".m3u8") ? "m3u8" : "mp4",
        headers: { "User-Agent": "Mozilla/5.0", Referer: "https://noodlemagazine.com/" },
      }));
    }
  } catch {}
  return [{ server: "Noodle Magazine", link, type: "mp4", headers: { "User-Agent": "Mozilla/5.0", Referer: "https://noodlemagazine.com/" } }];
};
