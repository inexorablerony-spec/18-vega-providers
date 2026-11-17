import { Stream, ProviderContext } from "../types";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const BASE = "https://xmoviesforyou.com";
const REFERER = "https://xmoviesforyou.com/";

export const getStream = async function ({ link, providerContext }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link) return [];
  const streams: Stream[] = [];
  const headers = { 
    "User-Agent": UA, 
    "Referer": REFERER,
    "Origin": BASE,
    "Accept": "*/*"
  };
  if (/\.m3u8(\?|$)/i.test(link)) {
    streams.push({ server: "XMF HLS", link, type: "m3u8", headers });
    return streams;
  }
  if (/\.mp4(\?|$)/i.test(link)) {
    streams.push({ server: "XMF MP4", link, type: "mp4", headers });
    return streams;
  }
  try {
    const axios = providerContext?.axios;
    if (!axios) return [];
    const res = await axios.get(link, { headers, timeout: 20000 });
    const html = res.data || "";
    const videoIdMatch = html.match(/videoId\s*=\s*"?(\d+)"?/);
    if (videoIdMatch) {
      const videoId = videoIdMatch[1];
      const streamRes = await axios.get(`${BASE}/api/stream/${videoId}`, { headers, timeout: 10000 });
      const streamData = streamRes.data;
      if (streamData && streamData.url) {
        streams.push({ server: "XMF HLS", link: streamData.url, type: "m3u8", headers });
      }
    }
  } catch {}
  return streams;
};
