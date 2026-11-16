import { Stream, ProviderContext } from "../types";
const UA = "Mozilla/5.0";
const REFERER = "https://sxyprn.com/";
export const getStream = async function ({ link, providerContext }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link) return [];
  const streams: Stream[] = [];
  try {
    const axios = providerContext?.axios;
    if (!axios) return [];
    const res = await axios.get(link, { headers: { "User-Agent": UA, Referer: REFERER }, timeout: 20000 });
    const html = res.data || "";
    const re = /(?:src|data-puri|data-src)\s*=\s*["']([^"']+\.(?:mp4|m3u8|vid)[^"']*)["']/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(html)) !== null) {
      let url = m[1];
      if (url.startsWith("//")) url = "https:" + url;
      if (!url.includes("thumb")) streams.push({ server: "SP3 Player", link: url, type: /\.m3u8/i.test(url) ? "m3u8" : "mp4", headers: { "User-Agent": UA, Referer: REFERER } });
    }
  } catch {}
  return streams;
};
