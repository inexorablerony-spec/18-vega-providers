import { Stream, ProviderContext } from "../types";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
const REFERER = "https://www.hornyleak.tv/";

export const getStream = async function ({ link, providerContext }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link) return [];
  const streams: Stream[] = [];
  const headers = { "User-Agent": UA, Referer: REFERER };
  if (/\.mp4/i.test(link)) {
    streams.push({ server: "HornyLeak Preview", link, type: "mp4", headers });
    return streams;
  }
  try {
    const axios = providerContext?.axios;
    if (!axios) return [];
    const res = await axios.get(link, { headers, timeout: 20000 });
    const html = res.data || "";
    const mp4Matches = html.match(/https?:\/\/[^"'\s]+\.mp4[^"'\s]*/gi) || [];
    const seen = new Set<string>();
    for (const url of [...new Set(mp4Matches)] as string[]) {
      if (url.includes("preview") && !seen.has(url)) {
        seen.add(url);
        streams.push({ server: "HornyLeak Preview", link: url, type: "mp4", headers });
      }
    }
  } catch {}
  return streams;
};
