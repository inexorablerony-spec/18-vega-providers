import { Stream, ProviderContext } from "../types";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const REFERER = "https://www.youjizz.com/";

function extractSources(html: string): any[] {
  const sources: any[] = [];
  const regex = /\{"quality":"(\d+)","filename":"([^"]+)"[^}]*"name":"([^"]+)"\}/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    sources.push({
      quality: match[1],
      filename: match[2].replace(/\\\//g, "/").replace(/&amp;/g, "&"),
      name: match[3],
    });
  }
  return sources;
}

export const getStream = async function ({ link, providerContext }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link) return [];
  const streams: Stream[] = [];
  const headers = { "User-Agent": UA, Referer: REFERER };

  // Direct MP4
  if (/\.mp4(\?|$)/i.test(link)) {
    streams.push({ server: "YouJizz", link, type: "mp4", headers });
    return streams;
  }

  try {
    const axios = providerContext?.axios;
    if (!axios) return [];
    const res = await axios.get(link, { headers, timeout: 20000 });
    const html = res.data || "";
    const sources = extractSources(html);
    const seen = new Set<string>();
    for (const source of sources) {
      let url = source.filename;
      if (url.startsWith("//")) url = "https:" + url;
      if (seen.has(url)) continue;
      seen.add(url);
      streams.push({
        server: `YouJizz ${source.name}`,
        link: url,
        type: "mp4",
        headers,
      });
    }
  } catch {}
  return streams;
};
