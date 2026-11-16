import { Stream, ProviderContext } from "../types";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
const REFERER = "https://noodlemagazine.com/";

export const getStream = async function ({ link, providerContext }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link) return [];
  const streams: Stream[] = [];
  try {
    const axios = providerContext?.axios;
    if (!axios) return [];
    const res = await axios.get(link, { headers: { "User-Agent": UA, Referer: REFERER }, timeout: 20000 });
    const html = res.data || "";
    const jsonRe = /(?:player|config|sources|file)\s*[:=]\s*(\{[^}]{20,}\}|[^\s"']+\.(?:mp4|m3u8))/gi;
    let m: RegExpExecArray | null;
    while ((m = jsonRe.exec(html)) !== null) {
      const val = m[1];
      if (/\.(mp4|m3u8)/i.test(val)) {
        let url = val;
        if (url.startsWith("//")) url = "https:" + url;
        streams.push({ server: "NM-JSON", link: url, type: /\.m3u8/i.test(url) ? "m3u8" : "mp4", headers: { "User-Agent": UA, Referer: REFERER } });
      }
    }
  } catch {}
  return streams;
};
