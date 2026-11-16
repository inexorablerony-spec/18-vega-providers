import { Stream, ProviderContext } from "../types";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export const getStream = async function ({
  link,
  providerContext,
}: {
  link: string;
  providerContext?: ProviderContext;
}): Promise<Stream[]> {
  if (!link) return [];
  const streams: Stream[] = [];

  try {
    const axios = providerContext?.axios;
    if (!axios) return [];

    const res = await axios.get(link, {
      headers: { "User-Agent": UA, Referer: "https://www.wowxxx.to/" },
      timeout: 20000,
    });
    const html = res.data || "";

    // Extract get_file MP4s
    const mp4Re = /https?:\/\/[^"'\s]+get_file[^"'\s]+\.mp4[^"'\s]*/gi;
    const matches = html.match(mp4Re) || [];
    const unique = [...new Set(matches)];

    for (const url of unique as string[]) {
      let quality = "auto";
      const fnMatch = url.match(/download_filename=[^&]*_(\d+)[a-z]?\.mp4/i);
      if (fnMatch) quality = fnMatch[1] + "p";
      else if (url.includes("_720")) quality = "720p";
      else if (url.includes("_1080")) quality = "1080p";
      else if (url.includes("_480")) quality = "480p";
      else if (url.includes("_360")) quality = "360p";

      streams.push({
        server: `WowXXX ${quality}`,
        link: url,
        type: "mp4",
        headers: { "User-Agent": UA, Referer: "https://www.wowxxx.to/" },
      });
    }

    // Also check for source tags
    const sourceRe = /<source[^>]+src=["']([^"']+\.mp4[^"']*)["'][^>]*>/gi;
    let m: RegExpExecArray | null;
    while ((m = sourceRe.exec(html)) !== null) {
      let src = m[1];
      if (src.startsWith("//")) src = "https:" + src;
      if (!streams.some(s => s.link === src)) {
        streams.push({
          server: "WowXXX",
          link: src,
          type: "mp4",
          headers: { "User-Agent": UA, Referer: "https://www.wowxxx.to/" },
        });
      }
    }
  } catch {}

  return streams;
};
