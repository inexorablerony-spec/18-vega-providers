import { Stream, ProviderContext } from "../types";
const UA = "Mozilla/5.0";
const REFERER = "https://www.hornyleak.tv/";

export const getStream = async function ({ link, providerContext }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link) return [];
  const streams: Stream[] = [];
  const headers = { "User-Agent": UA, Referer: REFERER };
  if (/\.mp4(\?|$)/i.test(link)) {
    streams.push({ server: "HornyLeak", link, type: "mp4", headers });
    return streams;
  }
  try {
    const axios = providerContext?.axios;
    if (!axios) return [];
    const res = await axios.get(link, { headers, timeout: 20000 });
    const html = res.data || "";
    const matches = html.match(/https?:\/\/hdplayer[^"'\s]+\.mp4[^"'\s]*/gi) || [];
    for (const url of matches as string[]) {
      if (url.includes("preview")) continue;
      streams.push({ server: "HornyLeak", link: url, type: "mp4", headers });
    }
  } catch {}
  return streams;
};
