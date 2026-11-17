import { Stream, ProviderContext } from "../types";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const REFERER = "https://dirtyship.com/";

export const getStream = async function ({ link, providerContext }: { link: string; providerContext?: ProviderContext }): Promise<Stream[]> {
  if (!link) return [];
  const streams: Stream[] = [];
  const headers = { "User-Agent": UA, Referer: REFERER, Origin: REFERER, Accept: "*/*" };
  if (/\.mp4(\?|$)/i.test(link)) {
    streams.push({ server: "DirtyShip", link, type: "mp4", headers });
    return streams;
  }
  try {
    const axios = providerContext?.axios;
    if (!axios) return [];
    const res = await axios.get(link, { headers, timeout: 20000 });
    const html = res.data || "";
    const matches = html.match(/https?:\/\/cdn[^"'\s]+\.mp4/gi) || [];
    for (const url of [...new Set(matches as string[])]) {
      streams.push({ server: "DirtyShip", link: url, type: "mp4", headers });
    }
  } catch {}
  return streams;
};
