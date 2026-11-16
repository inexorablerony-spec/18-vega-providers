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
      headers: { "User-Agent": UA, Referer: "https://pxp.pink/" },
      timeout: 20000,
    });
    const html = res.data || "";

    // Extract <source> tags with quality titles
    const sourceRe = /<source[^>]+src=["']([^"']+)["'][^>]*title=["']([^"']+)["'][^>]*>/gi;
    let m: RegExpExecArray | null;
    while ((m = sourceRe.exec(html)) !== null) {
      let src = m[1];
      const quality = m[2] || "auto";
      if (src.startsWith("//")) src = "https:" + src;
      if (src.startsWith("/")) src = "https://pxp.pink" + src;
      if (src.includes(".mp4") || src.includes(".m3u8")) {
        streams.push({
          server: `PornXP ${quality}`,
          link: src,
          type: src.includes(".m3u8") ? "m3u8" : "mp4",
          headers: { "User-Agent": UA, Referer: "https://pxp.pink/" },
        });
      }
    }

    // Fallback: any mp4 in page
    if (streams.length === 0) {
      const mp4s = html.match(/https?:\/\/[^"'\s]+\.mp4[^"'\s]*/gi) || [];
      const unique = [...new Set(mp4s)];
      for (const u of unique as string[]) {
        streams.push({
          server: "PornXP",
          link: u,
          type: "mp4",
          headers: { "User-Agent": UA, Referer: "https://pxp.pink/" },
        });
      }
    }
  } catch {}

  return streams;
};
