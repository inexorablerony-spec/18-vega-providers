import { Stream, ProviderContext } from "../types";
const UA = "Mozilla/5.0";
const REFERER = "https://www.youjizz.com/";

function getQuality(url: string): string {
  if (url.includes("1920-1080")) return "1080p";
  if (url.includes("1280-720")) return "720p";
  if (url.includes("852-480")) return "480p";
  if (url.includes("640-360")) return "360p";
  if (url.includes("426-240")) return "240p";
  return "Auto";
}

export const getStream = async function ({ link, providerContext }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link) return [];
  const streams: Stream[] = [];
  const headers = { "User-Agent": UA, Referer: REFERER };
  if (/\.mp4/i.test(link)) {
    streams.push({ server: "YouJizz", link, type: "mp4", headers });
    return streams;
  }
  try {
    const axios = providerContext?.axios;
    if (!axios) return [];
    const res = await axios.get(link, { headers, timeout: 20000 });
    const html = res.data || "";
    const matches = html.match(/\/\/cdne-mobile\.youjizz\.com[^"'\s]+\.mp4[^"'\s]*/gi) || [];
    const seen = new Set<string>();
    for (const url of matches as string[]) {
      const fullUrl = url.startsWith("//") ? "https:" + url.replace(/&amp;/g, "&") : url.replace(/&amp;/g, "&");
      if (seen.has(fullUrl)) continue;
      seen.add(fullUrl);
      const quality = getQuality(fullUrl);
      streams.push({ server: `YouJizz ${quality}`, link: fullUrl, type: "mp4", headers });
    }
  } catch {}
  return streams;
};
