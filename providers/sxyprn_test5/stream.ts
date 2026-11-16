import { Stream, ProviderContext } from "../types";
const UA = "Mozilla/5.0";
const REFERER = "https://sxyprn.com/";
const BASE = "https://sxyprn.com";
export const getStream = async function ({ link, providerContext }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link) return [];
  const streams: Stream[] = [];
  const seen = new Set<string>();
  const headers = { "User-Agent": UA, Referer: REFERER };
  try {
    const axios = providerContext?.axios;
    if (!axios) return [];
    const res = await axios.get(link, { headers, timeout: 20000 });
    const html = res.data || "";
    const vnfoMatch = html.match(/data-vnfo=['"]([^'"]+)['"]/);
    if (vnfoMatch) {
      try {
        const data = JSON.parse(vnfoMatch[1].replace(/&quot;/g, '"'));
        for (const path of Object.values(data)) {
          if (typeof path !== "string") continue;
          let url = path;
          if (url.startsWith("/")) url = BASE + url;
          else if (!url.startsWith("http")) url = BASE + "/" + url;
          if (!seen.has(url)) { seen.add(url); streams.push({ server: "SP5 VNFO", link: url, type: "mp4", headers }); }
        }
      } catch {}
    }
    const matches = html.match(/https?:\\?\/\\?\/[^"'\\\s]+\.(?:mp4|m3u8)[^"'\\\s]*/gi) || [];
    for (const u of matches as string[]) {
      const url = u.replace(/\\\//g, "/");
      if (url.includes("thumb") || seen.has(url)) continue;
      seen.add(url);
      streams.push({ server: "SP5", link: url, type: /\.m3u8/i.test(url) ? "m3u8" : "mp4", headers });
    }
  } catch {}
  return streams;
};
