import { Stream, ProviderContext } from "../types";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
const REFERER = "https://noodlemagazine.com/";

export const getStream = async function ({ link, providerContext }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link) return [];
  const streams: Stream[] = [];
  try {
    const axios = providerContext?.axios;
    if (!axios) return [];
    const idMatch = link.match(/watch\/([^/?]+)/);
    const id = idMatch ? idMatch[1] : "";
    const embedUrl = id ? `https://noodlemagazine.com/embed/${id}` : link;
    const res = await axios.get(embedUrl, { headers: { "User-Agent": UA, Referer: REFERER }, timeout: 20000 });
    const html = res.data || "";
    const matches = html.match(/https?:\\?\/\\?\/[^"'\\\s]+\.(?:mp4|m3u8)[^"'\\\s]*/gi) || [];
    const unique = [...new Set(matches.map((u: string) => u.replace(/\\\//g, "/")))];
    for (const url of unique as string[]) {
      streams.push({ server: "NM-Embed", link: url, type: /\.m3u8/i.test(url) ? "m3u8" : "mp4", headers: { "User-Agent": UA, Referer: REFERER } });
    }
  } catch {}
  return streams;
};
