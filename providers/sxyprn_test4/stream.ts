import { Stream, ProviderContext } from "../types";
const UA = "Mozilla/5.0";
const REFERER = "https://sxyprn.com/";
const BASE = "https://sxyprn.com";
export const getStream = async function ({ link, providerContext }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link) return [];
  const streams: Stream[] = [];
  try {
    const axios = providerContext?.axios;
    if (!axios) return [];
    const res = await axios.get(link, { headers: { "User-Agent": UA, Referer: REFERER }, timeout: 20000 });
    const html = res.data || "";
    const re = /<source[^>]+src=["']([^"']+)["'][^>]*>/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(html)) !== null) {
      let src = m[1];
      if (src.includes("thumb")) continue;
      if (src.startsWith("//")) src = "https:" + src;
      if (src.startsWith("/")) src = BASE + src;
      if (/\.(mp4|m3u8|vid)/i.test(src)) {
        streams.push({ server: "SP4 Source", link: src, type: /\.m3u8/i.test(src) ? "m3u8" : "mp4", headers: { "User-Agent": UA, Referer: REFERER } });
      }
    }
  } catch {}
  return streams;
};
