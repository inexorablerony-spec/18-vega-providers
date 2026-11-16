import { Stream, ProviderContext } from "../types";
const UA = "Mozilla/5.0";
const REFERER = "https://xhamster.com/";
export const getStream = async function ({ link, providerContext }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link) return [];
  const streams: Stream[] = [];
  const seen = new Set<string>();
  const headers = { "User-Agent": UA, Referer: REFERER };
  if (/\.(mp4|m3u8)(\?|$)/i.test(link)) {
    streams.push({ server: "T5 Direct", link, type: /\.m3u8/i.test(link) ? "m3u8" : "mp4", headers });
    seen.add(link);
  }
  try {
    const axios = providerContext?.axios;
    if (!axios) return streams;
    const res = await axios.get(link, { headers, timeout: 20000 });
    const html = res.data || "";
    const matches = html.match(/https?:[^"'\s]+\.(?:mp4|m3u8)[^"'\s]*/gi) || [];
    for (const url of matches as string[]) {
      if (url.includes("thumb") || url.includes("preview") || seen.has(url)) continue;
      seen.add(url);
      streams.push({ server: "T5", link: url, type: /\.m3u8/i.test(url) ? "m3u8" : "mp4", headers });
    }
  } catch {}
  return streams;
};
