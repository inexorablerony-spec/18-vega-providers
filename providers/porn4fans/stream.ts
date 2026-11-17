import { Stream, ProviderContext } from "../types";
const UA = "Mozilla/5.0";
const REFERER = "https://www.porn4fans.com/";

export const getStream = async function ({ link, providerContext }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link) return [];
  const streams: Stream[] = [];
  const headers = { "User-Agent": UA, Referer: REFERER };
  if (/\.mp4(\?|$)/i.test(link)) {
    streams.push({ server: "Porn4Fans", link, type: "mp4", headers });
    return streams;
  }
  try {
    const axios = providerContext?.axios;
    if (!axios) return [];
    const res = await axios.get(link, { headers, timeout: 20000 });
    const html = res.data || "";
    const urlPattern = /video_(?:alt_)?url(?:\d+)?:\s*'([^']+\.mp4[^']*)'/gi;
    const textPattern = /video_(?:alt_)?url(?:\d+)?_text:\s*'([^']+)'/gi;
    const urls: string[] = [];
    const texts: string[] = [];
    let m;
    while ((m = urlPattern.exec(html)) !== null) urls.push(m[1]);
    while ((m = textPattern.exec(html)) !== null) texts.push(m[1]);
    for (let i = 0; i < urls.length; i++) {
      if (urls[i].includes("login-required")) continue;
      const quality = texts[i] || "HD";
      streams.push({ server: `Porn4Fans ${quality}`, link: urls[i], type: "mp4", headers });
    }
  } catch {}
  return streams;
};
