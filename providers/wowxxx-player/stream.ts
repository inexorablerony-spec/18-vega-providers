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
    const re = /(?:src|file|url)\s*[:=]\s*["']([^"']+\.mp4[^"']*)["']/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(html)) !== null) {
      let url = m[1];
      if (url.startsWith("//")) url = "https:" + url;
      if (url.startsWith("/")) url = "https://www.wowxxx.to" + url;
      streams.push({ server: "WX-Player", link: url, type: "mp4", headers: { "User-Agent": UA, Referer: REFERER } });
    }
  } catch {}
  return streams;
};
