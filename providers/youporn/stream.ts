import { Stream, ProviderContext } from "../types";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
const REFERER = "https://www.youporn.com/";

export const getStream = async function ({ 
  link, 
  providerContext 
}: { 
  link: string; 
  providerContext?: ProviderContext 
}): Promise<Stream[]> {
  if (!link) return [];
  
  const streams: Stream[] = [];
  const headers = { "User-Agent": UA, Referer: REFERER };

  if (/\.mp4/i.test(link) && !link.includes("_fb.mp4")) {
    streams.push({ server: "YouPorn MP4", link, type: "mp4", headers });
    return streams;
  }
  if (/\.m3u8/i.test(link)) {
    streams.push({ server: "YouPorn HLS", link, type: "m3u8", headers });
    return streams;
  }

  try {
    const axios = providerContext?.axios;
    if (!axios) return [];

    const res = await axios.get(link, { headers, timeout: 20000 });
    const html = res.data || "";

    const mediaMatch = html.match(/mediaDefinitions"\s*:\s*(\[[^\]]+\])/);
    if (mediaMatch) {
      try {
        const definitions = JSON.parse(mediaMatch[1].replace(/\\/g, ""));
        for (const def of definitions) {
          if (def.videoUrl) {
            const type = def.format === "hls" ? "m3u8" : "mp4";
            const label = def.format === "hls" ? "HLS" : "MP4";
            streams.push({
              server: `YouPorn ${label}`,
              link: def.videoUrl,
              type,
              headers
            });
          }
        }
      } catch {}
    }
  } catch {}

  return streams;
};
