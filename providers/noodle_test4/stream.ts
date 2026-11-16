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
    const re = /<source[^>]+src=["']([^"']+)["'][^>]*(?:title=["']([^"']+)["'])?[^>]*>/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(html)) !== null) {
      let src = m[1];
      const label = m[2] || "auto";
      if (src.includes("preview") || src.includes("thumb")) continue;
      if (src.startsWith("//")) src = "https:" + src;
      if (src.startsWith("/")) src = "https://noodlemagazine.com" + src;
      if (/\.(mp4|m3u8)/i.test(src)) {
        streams.push({ server: `NT4 ${label}`, link: src, type: /\.m3u8/i.test(src) ? "m3u8" : "mp4", headers: { "User-Agent": UA, Referer: REFERER } });
      }
    }
  } catch {}
  return streams;
};
