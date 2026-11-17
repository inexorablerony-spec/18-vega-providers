import { Stream, ProviderContext } from "../types";
const UA = "Mozilla/5.0";
const REFERER = "https://www.hornyleak.tv/";

export const getStream = async function ({ link, providerContext }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link) return [];
  const streams: Stream[] = [];
  const headers = { "User-Agent": UA, Referer: REFERER };
  if (/\.mp4(\?|$)/i.test(link)) {
    streams.push({ server: "HornyLeak", link, type: "mp4", headers });
    return streams;
  }
  try {
    const axios = providerContext?.axios;
    if (!axios) return [];
    const res = await axios.get(link, { headers, timeout: 20000 });
    const html = res.data || "";
    const embedMatch = html.match(/iframe[^>]+src="([^"]*embed[^"]+)"/i);
    if (embedMatch) {
      const embedUrl = embedMatch[1];
      const embedRes = await axios.get(embedUrl, { headers, timeout: 15000 });
      const embedHtml = embedRes.data || "";
      const mp4Match = embedHtml.match(/https?:\/\/[^"'\s]+\.mp4[^"'\s]*/gi) || [];
      for (const url of mp4Match as string[]) {
        if (url.includes("preview")) continue;
        streams.push({ server: "HornyLeak", link: url, type: "mp4", headers });
      }
    }
    const directMatch = html.match(/https?:\/\/hdplayer[^"'\s]+\.mp4[^"'\s]*/gi) || [];
    for (const url of directMatch as string[]) {
      if (url.includes("preview")) continue;
      streams.push({ server: "HornyLeak", link: url, type: "mp4", headers });
    }
  } catch {}
  return streams;
};
