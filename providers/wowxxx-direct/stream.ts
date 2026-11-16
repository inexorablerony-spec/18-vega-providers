import { Stream, ProviderContext } from "../types";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
const REFERER = "https://www.wowxxx.to/";

export const getStream = async function ({ link, providerContext }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link) return [];
  const streams: Stream[] = [];
  try {
    const axios = providerContext?.axios;
    if (!axios) return [];
    const res = await axios.get(link, { headers: { "User-Agent": UA, Referer: REFERER }, timeout: 20000 });
    const html = res.data || "";
    const matches = html.match(/https?:\\?\/\\?\/[^"'\\\s]+get_file[^"'\\\s]+\.mp4[^"'\\\s]*/gi) || [];
    const unique = [...new Set(matches.map((u: string) => u.replace(/\\\//g, "/")))];
    for (const url of unique as string[]) {
      let q = "auto";
      if (url.includes("_720")) q = "720p";
      else if (url.includes("_1080")) q = "1080p";
      else if (url.includes("_480")) q = "480p";
      streams.push({ server: `WX-Direct ${q}`, link: url, type: "mp4", headers: { "User-Agent": UA, Referer: REFERER } });
    }
  } catch {}
  return streams;
};
