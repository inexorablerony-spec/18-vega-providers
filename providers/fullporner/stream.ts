import { Stream, ProviderContext } from "../types";
const UA = "Mozilla/5.0";
const REFERER = "https://fullporner.com/";
export const getStream = async function ({ link, providerContext }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link) return [];
  const streams: Stream[] = [];
  const headers = { "User-Agent": UA, Referer: REFERER };
  if (/\.mp4/i.test(link) || /\.m3u8/i.test(link)) { streams.push({ server: "FullPorner", link, type: /\.m3u8/i.test(link) ? "m3u8" : "mp4", headers }); return streams; }
  try {
    const axios = providerContext?.axios;
    if (!axios) return [];
    const res = await axios.get(link, { headers, timeout: 20000 });
    const html = res.data || "";
    const embedMatch = html.match(/iframe[^>]+src="([^"]*player[^"]+)"/i);
    if (embedMatch) {
      const embedUrl = embedMatch[1].startsWith("//") ? "https:" + embedMatch[1] : embedMatch[1];
      const embedRes = await axios.get(embedUrl, { headers, timeout: 15000 });
      const embedHtml = embedRes.data || "";
      const mp4Match = embedHtml.match(/https?:\/\/[^"'\s]+\.mp4[^"'\s]*/gi) || [];
      const m3u8Match = embedHtml.match(/https?:\/\/[^"'\s]+\.m3u8[^"'\s]*/gi) || [];
      for (const url of [...new Set([...mp4Match, ...m3u8Match] as string[])]) {
        streams.push({ server: "FullPorner", link: url, type: url.includes(".m3u8") ? "m3u8" : "mp4", headers });
      }
    }
  } catch {}
  return streams;
};
