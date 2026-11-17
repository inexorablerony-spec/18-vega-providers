import { Stream, ProviderContext } from "../types";
const UA = "Mozilla/5.0";
const REFERER = "https://www.youjizz.com/";

export const getStream = async function ({ link, providerContext }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link) return [];
  const streams: Stream[] = [];
  const headers = { "User-Agent": UA, Referer: REFERER };
  if (/\.mp4/i.test(link)) { streams.push({ server: "YouJizz", link, type: "mp4", headers }); return streams; }
  try {
    const axios = providerContext?.axios;
    if (!axios) return [];
    const res = await axios.get(link, { headers, timeout: 20000 });
    const html = res.data || "";
    const matches = html.match(/\/\/cdne-mobile\.youjizz\.com[^"'\s]+\.mp4[^"'\s]*/gi) || [];
    const seen = new Set<string>();
    for (const url of matches as string[]) {
      const fullUrl = url.startsWith("//") ? "https:" + url : url;
      if (seen.has(fullUrl)) continue;
      seen.add(fullUrl);
      const resMatch = url.match(/(\d+)-(\d+)-(\d+)-h264/);
      let quality = "SD";
      if (resMatch) {
        const height = parseInt(resMatch[2]);
        if (height >= 1080) quality = "1080p";
        else if (height >= 720) quality = "720p";
        else if (height >= 480) quality = "480p";
        else if (height >= 360) quality = "360p";
        else if (height >= 240) quality = "240p";
        else quality = "144p";
      }
      streams.push({ server: `YouJizz ${quality}`, link: fullUrl, type: "mp4", headers });
    }
  } catch {}
  return streams;
};
