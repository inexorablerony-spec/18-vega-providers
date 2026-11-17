import { Stream, ProviderContext } from "../types";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const REFERER = "https://noodlemagazine.tv/";

function getQuality(url: string): string {
  if (url.includes("1080")) return "1080p";
  if (url.includes("720")) return "720p";
  if (url.includes("480")) return "480p";
  if (url.includes("360")) return "360p";
  return "Auto";
}

export const getStream = async function ({ link, providerContext }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link) return [];
  const streams: Stream[] = [];
  const headers = { "User-Agent": UA, Referer: REFERER };

  // Direct MP4/M3U8
  if (/\.(mp4|m3u8)(\?|$)/i.test(link)) {
    streams.push({ server: "Noodle", link, type: /\.m3u8/i.test(link) ? "m3u8" : "mp4", headers });
    return streams;
  }

  try {
    const axios = providerContext?.axios;
    if (!axios) return [];

    const res = await axios.get(link, { headers, timeout: 20000 });
    const html = res.data || "";

    // 1. Direct MP4/M3U8 in HTML
    const mp4Matches = html.match(/https?:\/\/[^"'\s]+\.mp4[^"'\s]*/gi) || [];
    const m3u8Matches = html.match(/https?:\/\/[^"'\s]+\.m3u8[^"'\s]*/gi) || [];
    for (const url of [...new Set([...mp4Matches, ...m3u8Matches] as string[])]) {
      if (!url.includes("preview") && !url.includes("thumb")) {
        const quality = getQuality(url);
        streams.push({ server: `Noodle ${quality}`, link: url, type: url.includes(".m3u8") ? "m3u8" : "mp4", headers });
      }
    }

    // 2. window.playlist
    const playlistMatch = html.match(/window\.playlist\s*=\s*(\{[\s\S]*?\});/);
    if (playlistMatch) {
      try {
        const playlist = JSON.parse(playlistMatch[1]);
        if (playlist.sources) {
          for (const source of playlist.sources) {
            if (source.file) {
              const url = source.file.startsWith("//") ? "https:" + source.file : source.file;
              const quality = source.label || getQuality(url);
              streams.push({ server: `Noodle ${quality}`, link: url, type: url.includes(".m3u8") ? "m3u8" : "mp4", headers });
            }
          }
        }
      } catch {}
    }

    // 3. Embed URL
    const embedMatch = html.match(/embed[^"]*"[^"]*"[^"]*"([^"]+)"/i);
    if (embedMatch && streams.length === 0) {
      const embedUrl = embedMatch[1];
      if (embedUrl && !embedUrl.includes("adtng")) {
        try {
          const embedRes = await axios.get(embedUrl, { headers, timeout: 15000 });
          const embedHtml = embedRes.data || "";
          const embedMp4 = embedHtml.match(/https?:\/\/[^"'\s]+\.mp4[^"'\s]*/gi) || [];
          const embedM3u8 = embedHtml.match(/https?:\/\/[^"'\s]+\.m3u8[^"'\s]*/gi) || [];
          for (const url of [...new Set([...embedMp4, ...embedM3u8] as string[])]) {
            const quality = getQuality(url);
            streams.push({ server: `Noodle ${quality}`, link: url, type: url.includes(".m3u8") ? "m3u8" : "mp4", headers });
          }
        } catch {}
      }
    }

    // 4. JSON sources
    const jsonMatch = html.match(/"sources":\s*\[([^\]]+)\]/);
    if (jsonMatch && streams.length === 0) {
      try {
        const sources = JSON.parse("[" + jsonMatch[1] + "]");
        for (const source of sources) {
          if (source.file) {
            const url = source.file.startsWith("//") ? "https:" + source.file : source.file;
            const quality = source.label || getQuality(url);
            streams.push({ server: `Noodle ${quality}`, link: url, type: url.includes(".m3u8") ? "m3u8" : "mp4", headers });
          }
        }
      } catch {}
    }

  } catch {}

  return streams;
};
